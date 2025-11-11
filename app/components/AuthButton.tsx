'use client';

import { useAuth } from '../contexts/AuthContext';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export function AuthButton() {
  const { isAuthenticated, isAuthenticating, login, logout } = useAuth();
  const { isConnected, address } = useAccount();

  // If wallet not connected, show RainbowKit connect button
  if (!isConnected) {
    return (
      <ConnectButton 
        accountStatus="avatar"
        chainStatus="icon"
        showBalance={false}
      />
    );
  }

  // Just show the connect button - auth happens automatically in background
  return (
    <ConnectButton 
      accountStatus="avatar"
      chainStatus="icon"
      showBalance={false}
    />
  );
}

