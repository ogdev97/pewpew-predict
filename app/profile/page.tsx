'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance } from 'wagmi';
import { useState, useEffect } from 'react';
import { DEFAULT_BET_AMOUNT } from '../contracts/config';

export default function Profile() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({
    address: address,
  });

  const [defaultBetAmount, setDefaultBetAmount] = useState(DEFAULT_BET_AMOUNT);
  const [customAmount, setCustomAmount] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const presetAmounts = ['0.001', '0.005', '0.01', '0.05', '0.1'];

  // Load saved bet amount from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('defaultBetAmount');
    if (saved) {
      setDefaultBetAmount(saved);
    }
  }, []);

  const handleSetBetAmount = (amount: string) => {
    setDefaultBetAmount(amount);
    localStorage.setItem('defaultBetAmount', amount);
    setCustomAmount('');
    
    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleCustomAmountSubmit = () => {
    const amount = parseFloat(customAmount);
    if (amount > 0 && amount <= 1) {
      handleSetBetAmount(customAmount);
    } else {
      alert('Please enter a valid amount between 0 and 1 BNB');
    }
  };

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

              {/* Bet Amount Settings Card */}
              <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Default Bet Amount
                  </h3>
                  {showSuccess && (
                    <div className="flex items-center gap-1 text-green-400 text-sm animate-fade-in">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Saved!
                    </div>
                  )}
                </div>

                {/* Current Default */}
                <div className="bg-black/30 rounded-2xl p-4 mb-4 text-center">
                  <p className="text-xs text-gray-400 mb-1">Current Default</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {defaultBetAmount} BNB
                  </p>
                </div>

                {/* Preset Amounts */}
                <div className="mb-4">
                  <p className="text-sm text-gray-300 mb-3 font-medium">Quick Select</p>
                  <div className="grid grid-cols-3 gap-2">
                    {presetAmounts.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => handleSetBetAmount(amount)}
                        className={`py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                          defaultBetAmount === amount
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                            : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700'
                        }`}
                      >
                        {amount}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Amount Input */}
                <div>
                  <p className="text-sm text-gray-300 mb-3 font-medium">Custom Amount</p>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <input
                        type="number"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        placeholder="0.000"
                        step="0.001"
                        min="0"
                        max="1"
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-xl pl-4 pr-16 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
                        BNB
                      </span>
                    </div>
                    <button
                      onClick={handleCustomAmountSubmit}
                      disabled={!customAmount || parseFloat(customAmount) <= 0}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Set
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Enter amount between 0 and 1 BNB</p>
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
      <div className="fixed bottom-0 left-0 right-0 pb-2 px-4 bg-gradient-to-t from-dark-bg via-dark-bg to-transparent">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-dark-card/90 backdrop-blur-lg rounded-2xl border border-gray-800">
            <div className="flex justify-around items-center py-2">
              {/* Profile - Active */}
              <Link href="/profile" className="flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/50">
                <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-[10px] text-purple-400 font-semibold">Profile</span>
              </Link>

              {/* Predict */}
              <Link href="/" className="flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all hover:bg-gray-800/50">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span className="text-[10px] text-gray-400 font-medium">Predict</span>
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

