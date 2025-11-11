import { verifyMessage } from 'viem';

/**
 * Generate a nonce for SIWE (Sign-In With Ethereum)
 */
export function generateNonce(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

/**
 * Generate a SIWE message for the user to sign
 */
export function generateSiweMessage(
  address: string,
  nonce: string,
  domain: string = typeof window !== 'undefined' ? window.location.host : 'localhost'
): string {
  const issuedAt = new Date().toISOString();
  
  return `${domain} wants you to sign in with your Ethereum account:
${address}

Sign in to GoalGuru

URI: ${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}
Version: 1
Chain ID: 56
Nonce: ${nonce}
Issued At: ${issuedAt}`;
}

/**
 * Verify a signed message
 */
export async function verifySiweSignature(
  message: string,
  signature: string,
  address: string
): Promise<boolean> {
  try {
    const valid = await verifyMessage({
      address: address as `0x${string}`,
      message: message,
      signature: signature as `0x${string}`,
    });
    return valid;
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
}

/**
 * Session data structure
 */
export interface AuthSession {
  userId: string;
  walletAddress: string;
  signature: string;
  message: string;
  nonce: string;
  expiresAt: number;
  createdAt: number;
}

/**
 * Store session in localStorage with 24hr expiry
 */
export function storeSession(session: AuthSession): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('auth_session', JSON.stringify(session));
  } catch (error) {
    console.error('Error storing session:', error);
  }
}

/**
 * Get session from localStorage
 */
export function getSession(): AuthSession | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const sessionStr = localStorage.getItem('auth_session');
    if (!sessionStr) return null;
    
    const session: AuthSession = JSON.parse(sessionStr);
    
    // Check if session is expired
    if (Date.now() > session.expiresAt) {
      clearSession();
      return null;
    }
    
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

/**
 * Clear session from localStorage
 */
export function clearSession(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem('auth_session');
  } catch (error) {
    console.error('Error clearing session:', error);
  }
}

/**
 * Check if session is valid
 */
export function isSessionValid(): boolean {
  const session = getSession();
  return session !== null && Date.now() < session.expiresAt;
}

/**
 * Get session duration (24 hours in milliseconds)
 */
export const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

