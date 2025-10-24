'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance } from 'wagmi';

export default function Profile() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({
    address: address,
  });

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <main className="min-h-screen w-full p-4 md:p-8 pb-40">
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="py-4 px-2">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Profile
            </h1>
            <ConnectButton 
              accountStatus="avatar"
              chainStatus="icon"
              showBalance={false}
            />
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

        {/* Profile Content */}
        <div className="px-2">
          {isConnected ? (
            <div className="space-y-4 mb-8">
              {/* Profile Card */}
              <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                    <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">
                    {address && formatAddress(address)}
                  </h2>
                  <p className="text-sm text-gray-400">Prediction Trader</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/30 rounded-2xl p-4 text-center">
                    <p className="text-2xl font-bold text-purple-400">12</p>
                    <p className="text-xs text-gray-400 mt-1">Predictions</p>
                  </div>
                  <div className="bg-black/30 rounded-2xl p-4 text-center">
                    <p className="text-2xl font-bold text-pink-400">67%</p>
                    <p className="text-xs text-gray-400 mt-1">Win Rate</p>
                  </div>
                </div>
              </div>

              {/* Stats Section */}
              <div className="bg-dark-card/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Total Volume</span>
                    <span className="text-white font-semibold">45.23 BNB</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Best Streak</span>
                    <span className="text-white font-semibold">8 wins</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Total Earnings</span>
                    <span className="text-green-400 font-semibold">+12.45 BNB</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-dark-card/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-800">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <span className="text-green-400 font-bold text-sm">YES</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">BNB will reach $1000</p>
                      <p className="text-gray-500 text-xs">2 hours ago</p>
                    </div>
                    <span className="text-green-400 text-sm font-semibold">+2.3 BNB</span>
                  </div>
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-800">
                    <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                      <span className="text-red-400 font-bold text-sm">NO</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">Bitcoin ETF approval</p>
                      <p className="text-gray-500 text-xs">5 hours ago</p>
                    </div>
                    <span className="text-red-400 text-sm font-semibold">-1.5 BNB</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <span className="text-green-400 font-bold text-sm">YES</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">DeFi TVL exceed $200B</p>
                      <p className="text-gray-500 text-xs">1 day ago</p>
                    </div>
                    <span className="text-green-400 text-sm font-semibold">+3.7 BNB</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <svg className="w-24 h-24 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <h3 className="text-xl font-bold text-white mb-2">Connect Your Wallet</h3>
                <p className="text-gray-400 text-sm">Please connect your wallet to view your profile</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation - Fixed */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-dark-bg via-dark-bg to-transparent">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-dark-card/90 backdrop-blur-lg rounded-3xl border border-gray-800 px-2 py-2">
            <div className="flex justify-around items-center">
              {/* Profile - Active */}
              <Link href="/profile" className="flex flex-col items-center gap-1 py-2 px-4 rounded-2xl bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/50">
                <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-xs text-purple-400 font-semibold">Profile</span>
              </Link>

              {/* Predict */}
              <Link href="/" className="flex flex-col items-center gap-1 py-2 px-4 rounded-2xl transition-all hover:bg-gray-800/50">
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span className="text-xs text-gray-400 font-medium">Predict</span>
              </Link>

              {/* Quest */}
              <Link href="/quest" className="flex flex-col items-center gap-1 py-2 px-4 rounded-2xl transition-all hover:bg-gray-800/50">
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <span className="text-xs text-gray-400 font-medium">Quest</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

