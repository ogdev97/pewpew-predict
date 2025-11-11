'use client';

import Link from 'next/link';
import { AuthButton } from './components/AuthButton';
import { AuthErrorToast } from './components/AuthErrorToast';
import { SwipeCards } from './components/SwipeCards';
import { useAccount, useBalance } from 'wagmi';
import { useAuth } from './contexts/AuthContext';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({
    address: address,
  });
  const { isAuthenticated } = useAuth();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <main className="min-h-screen w-full p-4 md:p-8 pb-24">
      <AuthErrorToast />
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="py-4 px-2">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            GoalGuru
            </h1>
            <AuthButton />
          </div>
          
          {/* Wallet Info - Show when connected */}
          {isConnected && address && (
            <div className="flex justify-between items-center text-xs mt-3">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Wallet:</span>
                <span className="font-mono text-purple-300 font-medium">
                  {formatAddress(address)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Balance:</span>
                <span className="font-semibold text-pink-300">
                  {balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : '0.0000'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Swipe Cards */}
        <div className="flex items-center justify-center py-4">
          <SwipeCards />
        </div>
      </div>

      {/* Bottom Navigation - Fixed */}
      <div className="fixed bottom-0 left-0 right-0 pb-2 px-4 bg-gradient-to-t from-dark-bg via-dark-bg to-transparent">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-dark-card/90 backdrop-blur-lg rounded-2xl border border-gray-800">
            <div className="flex justify-around items-center py-2">
              {/* Profile */}
              <Link href="/profile" className="flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all hover:bg-gray-800/50">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-[10px] text-gray-400 font-medium">Profile</span>
              </Link>

              {/* Predict - Active */}
              <Link href="/" className="flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/50">
                <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span className="text-[10px] text-purple-400 font-semibold">Predict</span>
              </Link>

              {/* Quest */}
              <Link href="/quest" className="flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all hover:bg-gray-800/50">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <span className="text-[10px] text-gray-400 font-medium">Quest</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

