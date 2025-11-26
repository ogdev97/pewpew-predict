'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { supabase } from '../utils/supabase';
import {
  generateNonce,
  generateSiweMessage,
  verifySiweSignature,
  storeSession,
  getSession,
  clearSession,
  isSessionValid,
  SESSION_DURATION,
  type AuthSession,
} from '../lib/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  userId: string | null;
  session: AuthSession | null;
  authError: string | null;
  clearError: () => void;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { address, isConnected, connector } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [hasCheckedSession, setHasCheckedSession] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [hasAttemptedLogin, setHasAttemptedLogin] = useState(false);

  // Check existing session on mount and validate with Supabase
  useEffect(() => {
    const checkAndRestoreSession = async () => {
      const existingSession = getSession();

      if (existingSession && isSessionValid()) {
        // Validate session exists in Supabase
        const { data: dbSession, error } = await supabase
          .from('login_sessions')
          .select('*')
          .eq('nonce', existingSession.nonce)
          .eq('wallet_address', existingSession.walletAddress)
          .gt('expires_at', new Date().toISOString())
          .single();

        if (dbSession) {
          // Valid session in both localStorage and Supabase
          setSession(existingSession);
          setUserId(existingSession.userId);
          setIsAuthenticated(true);
          setHasAttemptedLogin(true);
        } else {
          // Session not found in DB or expired, clear it
          clearSession();
        }
      } else {
      }

      setHasCheckedSession(true);
    };

    checkAndRestoreSession();
  }, []);

  // Handle wallet connection and authentication
  useEffect(() => {
    if (!hasCheckedSession || !isConnected || !address) return;

    const addressLower = address.toLowerCase();

    // Already authenticated for this wallet
    if (isAuthenticated && session?.walletAddress === addressLower) {
      return;
    }

    // Check if there's a valid session for this specific wallet
    const existingSession = getSession();

    if (existingSession && existingSession.walletAddress === addressLower && isSessionValid()) {
      // Restore session for this wallet
      setSession(existingSession);
      setUserId(existingSession.userId);
      setIsAuthenticated(true);
      setHasAttemptedLogin(true);
      return;
    }

    // Need to login - but only if we haven't tried yet and not already authenticating
    if (!hasAttemptedLogin && !isAuthenticating) {
      setHasAttemptedLogin(true);
      login();
    }
  }, [isConnected, address, hasCheckedSession, isAuthenticated, isAuthenticating, hasAttemptedLogin, session?.walletAddress]);

  // Auto-logout when wallet disconnects
  useEffect(() => {
    if (!isConnected && isAuthenticated) {
      logout();
      setHasAttemptedLogin(false);
    }
  }, [isConnected, isAuthenticated]);

  // Reset attempt flag when address changes (wallet switch)
  useEffect(() => {
    if (address && session && address.toLowerCase() !== session.walletAddress) {
      // Wallet switched, clear old session and reset
      clearSession();
      setSession(null);
      setUserId(null);
      setIsAuthenticated(false);
      setHasAttemptedLogin(false);
    }
  }, [address, session]);

  // Check if there's a valid session
  const checkAuth = () => {
    const existingSession = getSession();

    if (existingSession && isSessionValid()) {
      setSession(existingSession);
      setUserId(existingSession.userId);
      setIsAuthenticated(true);
    } else {
      setSession(null);
      setUserId(null);
      setIsAuthenticated(false);
    }
  };

  // Clear error
  const clearError = () => {
    setAuthError(null);
  };

  // Login function - signs message and creates session
  const login = async () => {
    if (!address || !isConnected) {
      setAuthError('Please connect your wallet first');
      return;
    }

    const addressLower = address.toLowerCase();

    // Check if already authenticated
    if (isAuthenticated && session?.walletAddress === addressLower) {
      return;
    }

    // Prevent concurrent login attempts
    if (isAuthenticating) {
      return;
    }

    setIsAuthenticating(true);
    setAuthError(null);

    try {
      // Generate nonce
      const nonce = generateNonce();

      // Generate SIWE message
      const message = generateSiweMessage(address, nonce);

      // Request signature from user
      const signature = await signMessageAsync({ message });

      // Verify signature (client-side check)
      const isValid = await verifySiweSignature(message, signature, address);

      if (!isValid) {
        throw new Error('Invalid signature');
      }

      // Check if user exists, create if not
      let { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('wallet_address', address.toLowerCase())
        .single();

      if (userError && userError.code === 'PGRST116') {
        // User doesn't exist, create new user
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            wallet_address: address.toLowerCase(),
          })
          .select()
          .single();

        if (createError) throw createError;
        user = newUser;
      } else if (userError) {
        throw userError;
      } else {
        // Update existing user's last login
        await supabase
          .from('users')
          .update({
            last_login_at: new Date().toISOString(),
          })
          .eq('id', user.id);
      }

      // Create session in database
      const expiresAt = new Date(Date.now() + SESSION_DURATION);

      const { data: sessionData, error: sessionError } = await supabase
        .from('login_sessions')
        .insert({
          user_id: user.id,
          wallet_address: address.toLowerCase(),
          signature,
          message,
          nonce,
          expires_at: expiresAt.toISOString(),
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      // Log activity
      await supabase
        .from('login_activity')
        .insert({
          user_id: user.id,
          wallet_address: address.toLowerCase(),
          action: 'login',
          user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : null,
        });

      // Store session locally
      const newSession: AuthSession = {
        userId: user.id,
        walletAddress: address.toLowerCase(),
        signature,
        message,
        nonce,
        expiresAt: expiresAt.getTime(),
        createdAt: Date.now(),
      };

      storeSession(newSession);
      setSession(newSession);
      setUserId(user.id);
      setIsAuthenticated(true);

    } catch (error: any) {

      if (error.message?.includes('User rejected') || error.message?.includes('rejected')) {
        setAuthError('Signature request was rejected. Please try again.');

        // Disconnect wallet after rejection
        try {
          await connector?.disconnect();
        } catch (disconnectError) {
          // Silent fail on disconnect error
        }
      } else {
        setAuthError('Authentication failed. Please try again.');
      }

      setIsAuthenticated(false);
      setSession(null);
      setUserId(null);
      setHasAttemptedLogin(false); // Reset so they can try again

      // Auto-clear error after 5 seconds
      setTimeout(() => {
        setAuthError(null);
      }, 5000);
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Logout function
  const logout = async () => {
    if (userId) {
      // Log activity
      await supabase
        .from('login_activity')
        .insert({
          user_id: userId,
          wallet_address: session?.walletAddress || '',
          action: 'logout',
        });

      // Optionally delete session from database
      if (session?.nonce) {
        await supabase
          .from('login_sessions')
          .delete()
          .eq('nonce', session.nonce);
      }
    }

    clearSession();
    setSession(null);
    setUserId(null);
    setIsAuthenticated(false);
    setHasAttemptedLogin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAuthenticating,
        userId,
        session,
        authError,
        clearError,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

