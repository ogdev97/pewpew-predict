'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance } from 'wagmi';

export default function Quest() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({
    address: address,
  });

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const quests = [
    {
      id: 1,
      title: 'First Prediction',
      description: 'Make your first prediction on any market',
      reward: '10 Guru',
      progress: 100,
      completed: true,
    },
    {
      id: 2,
      title: 'Hot Streak',
      description: 'Win 5 predictions in a row',
      reward: '25 Guru',
      progress: 60,
      completed: false,
    },
    {
      id: 3,
      title: 'Volume Trader',
      description: 'Trade a total volume of 100 Guru',
      reward: '50 Guru',
      progress: 45,
      completed: false,
    },
    {
      id: 4,
      title: 'Early Adopter',
      description: 'Connect wallet and explore all features',
      reward: '5 Guru',
      progress: 100,
      completed: true,
    },
    {
      id: 5,
      title: 'Market Master',
      description: 'Predict on 50 different markets',
      reward: '100 Guru',
      progress: 24,
      completed: false,
    },
    {
      id: 6,
      title: 'Diamond Hands',
      description: 'Hold a prediction for 30 days',
      reward: '75 Guru',
      progress: 0,
      completed: false,
    },
  ];

  return (
    <main className="min-h-screen w-full p-4 md:p-8 pb-40">
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="py-4 px-2">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            GoalGuru
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

        {/* Quest Content */}
        <div className="px-2">
          {isConnected ? (
            <div className="space-y-4 pb-8 mb-8">
              {/* Stats Card */}
              <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Quests Completed</p>
                    <p className="text-3xl font-bold text-white">
                      {quests.filter(q => q.completed).length}/{quests.length}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm mb-1">Total Rewards</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                      {quests.filter(q => q.completed).reduce((acc, q) => acc + parseFloat(q.reward), 0)} Guru
                    </p>
                  </div>
                </div>
              </div>

              {/* Quest List */}
              <div className="space-y-3">
                {quests.map((quest) => (
                  <div
                    key={quest.id}
                    className={`rounded-3xl p-5 border ${
                      quest.completed
                        ? 'bg-green-900/20 border-green-500/30'
                        : 'bg-dark-card/50 border-gray-800'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                        quest.completed
                          ? 'bg-green-500/20'
                          : 'bg-purple-500/20'
                      }`}>
                        {quest.completed ? (
                          <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-white font-bold text-base mb-1">{quest.title}</h3>
                            <p className="text-gray-400 text-sm">{quest.description}</p>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        {!quest.completed && (
                          <div className="mb-3">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs text-gray-500">Progress</span>
                              <span className="text-xs text-purple-400 font-semibold">{quest.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                                style={{ width: `${quest.progress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Reward */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                            </svg>
                            <span className="text-yellow-400 font-bold text-sm">{quest.reward}</span>
                          </div>
                          {quest.completed ? (
                            <span className="text-green-400 text-xs font-semibold px-3 py-1 bg-green-500/20 rounded-full">
                              Claimed
                            </span>
                          ) : (
                            <button 
                              disabled={quest.progress < 100}
                              className={`text-xs font-semibold px-4 py-2 rounded-full transition-all ${
                                quest.progress >= 100
                                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500'
                                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                              }`}
                            >
                              Claim
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <svg className="w-24 h-24 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <h3 className="text-xl font-bold text-white mb-2">Connect Your Wallet</h3>
                <p className="text-gray-400 text-sm">Please connect your wallet to view quests</p>
              </div>
            </div>
          )}
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

              {/* Predict */}
              <Link href="/" className="flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all hover:bg-gray-800/50">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span className="text-[10px] text-gray-400 font-medium">Predict</span>
              </Link>

              {/* Quest - Active */}
              <Link href="/quest" className="flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/50">
                <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <span className="text-[10px] text-purple-400 font-semibold">Quest</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

