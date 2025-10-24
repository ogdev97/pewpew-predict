'use client';

import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseEther } from 'viem';
import { PREDICTION_MARKET_ABI } from '../contracts/abi';
import { PREDICTION_MARKET_ADDRESS, DEFAULT_BET_AMOUNT } from '../contracts/config';

// Sample prediction markets
const predictions = [
  {
    id: 1,
    question: 'Will BNB reach $2000 by end of 2025?',
    image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=1200&fit=crop',
    yesOdds: '65%',
    noOdds: '35%',
  },
  {
    id: 2,
    question: 'Will PolyMarket announce TGE?',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=1200&fit=crop',
    yesOdds: '72%',
    noOdds: '28%',
  },
  {
    id: 3,
    question: 'Will Ethereum merge to PoS succeed?',
    image: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=800&h=1200&fit=crop',
    yesOdds: '88%',
    noOdds: '12%',
  },
  {
    id: 4,
    question: 'Will DeFi TVL exceed $200B this year?',
    image: 'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=800&h=1200&fit=crop',
    yesOdds: '54%',
    noOdds: '46%',
  },
];

export function SwipeCards() {
  const [cards, setCards] = useState(predictions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [betAmount, setBetAmount] = useState(DEFAULT_BET_AMOUNT);
  const [isPredicting, setIsPredicting] = useState(false);
  
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const currentCard = cards[currentIndex];

  // Move to next card only when transaction is successful
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        if (currentIndex < cards.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          setCurrentIndex(0);
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, currentIndex, cards.length]);

  // Reset isPredicting when transaction completes or fails
  useEffect(() => {
    if (isSuccess || error) {
      setIsPredicting(false);
    }
  }, [isSuccess, error]);

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (!isConnected) {
      alert('Please connect your wallet to predict');
      return;
    }

    if (isPredicting || isPending || isConfirming) {
      alert('Please wait for the previous transaction to complete');
      return;
    }

    if (!currentCard) return;

    const outcome = direction === 'right' ? 1 : 2; // 1 = YES, 2 = NO
    const prediction = direction === 'right' ? 'YES' : 'NO';
    
    try {
      setIsPredicting(true);
      
      // Call the predict function on the smart contract
      writeContract({
        address: PREDICTION_MARKET_ADDRESS,
        abi: PREDICTION_MARKET_ABI,
        functionName: 'predict',
        args: [BigInt(currentCard.id), BigInt(outcome)],
        value: parseEther(betAmount),
      });

      console.log(`🎯 Predicting ${prediction} on Market #${currentCard.id} with ${betAmount} BNB`);
      
    } catch (err) {
      console.error('Error placing prediction:', err);
      setIsPredicting(false);
      alert('Failed to place prediction. Please try again.');
    }
  };

  const handleSkip = (direction: 'up' | 'down') => {
    if (isPredicting || isPending || isConfirming) {
      return;
    }

    if (direction === 'up') {
      // Skip to next market
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex(0); // Loop back to first
      }
    } else {
      // Go back to previous market
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      } else {
        setCurrentIndex(cards.length - 1); // Loop to last
      }
    }
  };

  if (!currentCard) return null;

  return (
    <div className="relative w-full max-w-sm">
      {/* Market Counter Indicator */}
      <div className="mb-1 px-4">
        <div className="flex items-center justify-center gap-1">
          <div className="text-xs text-gray-400">
            Market {currentIndex + 1} of {cards.length}
          </div>
          <div className="flex gap-1">
            {cards.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'w-6 bg-gradient-to-r from-purple-500 to-pink-500' 
                    : 'w-1.5 bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* Skip Instructions */}
        <div className="mt-1 text-center">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
            Swipe up/down to browse markets
          </p>
        </div>
      </div>

      {/* Stack of cards */}
      <div className="relative w-full h-[480px]">
        {cards.slice(currentIndex, currentIndex + 3).map((card, index) => (
          <div
            key={card.id}
            className="absolute inset-0"
            style={{
              zIndex: cards.length - index,
              transform: `scale(${1 - index * 0.05}) translateY(${index * -10}px)`,
              opacity: 1 - index * 0.3,
            }}
          >
            {index === 0 ? (
              <SwipeCard 
                card={card} 
                onSwipe={handleSwipe}
                onSkip={handleSkip}
                isDisabled={isPending || isConfirming || isPredicting}
              />
            ) : (
              <div className="w-full h-full rounded-3xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50" />
            )}
          </div>
        ))}
      </div>

      {/* Transaction Status Toast - Bottom Right */}
      {(isPending || isConfirming || isSuccess || error) && (
        <div className="fixed bottom-20 right-4 z-50 animate-slide-in">
          <div className="bg-dark-card/95 backdrop-blur-lg border border-gray-800 rounded-2xl shadow-2xl p-4 min-w-[280px] max-w-[320px]">
            {isPending && (
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-yellow-400 border-t-transparent"></div>
                <div>
                  <p className="text-sm font-semibold text-white">Confirming...</p>
                  <p className="text-xs text-gray-400">Check your wallet</p>
                </div>
              </div>
            )}
            {isConfirming && (
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-400 border-t-transparent"></div>
                <div>
                  <p className="text-sm font-semibold text-white">Processing...</p>
                  <p className="text-xs text-gray-400">Transaction confirming</p>
                </div>
              </div>
            )}
            {isSuccess && !isPending && !isConfirming && (
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-green-400">Success!</p>
                  <p className="text-xs text-gray-400">Prediction placed</p>
                </div>
              </div>
            )}
            {error && !isPending && !isConfirming && (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-red-400">Failed</p>
                  <p className="text-xs text-gray-400 truncate">
                    {error.message.includes('User rejected') ? 'Transaction rejected' : 'Transaction failed'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SwipeCard({ 
  card, 
  onSwipe,
  onSkip,
  isDisabled 
}: { 
  card: typeof predictions[0]; 
  onSwipe: (direction: 'left' | 'right') => void;
  onSkip: (direction: 'up' | 'down') => void;
  isDisabled?: boolean;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  // Fetch market data from contract
  const { data: marketData } = useReadContract({
    address: PREDICTION_MARKET_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    functionName: 'getMarket',
    args: [BigInt(card.id)],
  });

  // Extract endTimestamp from marketData
  const endTimestamp = marketData ? Number(marketData[2]) : 0; // marketData[2] is endTimestamp

  const handleDragEnd = (event: any, info: any) => {
    if (isDisabled) {
      return;
    }
    
    // Check vertical swipe first (skip)
    if (Math.abs(info.offset.y) > Math.abs(info.offset.x) && Math.abs(info.offset.y) > 80) {
      const direction = info.offset.y < 0 ? 'up' : 'down';
      onSkip(direction);
      return;
    }
    
    // Then check horizontal swipe (predict)
    if (Math.abs(info.offset.x) > 100) {
      const direction = info.offset.x > 0 ? 'right' : 'left';
      onSwipe(direction);
    }
  };

  // Countdown timer state
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    if (!endTimestamp || endTimestamp === 0) {
      setTimeRemaining('Loading...');
      return;
    }

    const updateCountdown = () => {
      const now = Math.floor(Date.now() / 1000);
      const remaining = endTimestamp - now;

      if (remaining <= 0) {
        setTimeRemaining('Ended');
        return;
      }

      const days = Math.floor(remaining / 86400);
      const hours = Math.floor((remaining % 86400) / 3600);
      const minutes = Math.floor((remaining % 3600) / 60);
      const seconds = remaining % 60;

      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
      } else if (minutes > 0) {
        setTimeRemaining(`${minutes}m ${seconds}s`);
      } else {
        setTimeRemaining(`${seconds}s`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [endTimestamp]);

  // Show overlay based on swipe direction
  const yesOverlay = useTransform(x, [0, 100], [0, 1]);
  const noOverlay = useTransform(x, [-100, 0], [1, 0]);
  const skipOverlay = useTransform(y, [-100, 0], [1, 0]);

  return (
    <motion.div
      className={`w-full h-full ${isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-grab active:cursor-grabbing'}`}
      style={{ x, y, rotate }}
      drag={isDisabled ? false : true}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: isDisabled ? 'not-allowed' : 'grabbing' }}
    >
      <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-gray-700/50">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${card.image})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>

        {/* YES Overlay */}
        <motion.div 
          className="absolute inset-0 bg-green-500/30 flex items-center justify-center"
          style={{ opacity: yesOverlay }}
        >
          <div className="text-6xl font-bold text-green-500 rotate-12 border-4 border-green-500 px-8 py-4 rounded-2xl">
            YES
          </div>
        </motion.div>

        {/* NO Overlay */}
        <motion.div 
          className="absolute inset-0 bg-red-500/30 flex items-center justify-center"
          style={{ opacity: noOverlay }}
        >
          <div className="text-6xl font-bold text-red-500 -rotate-12 border-4 border-red-500 px-8 py-4 rounded-2xl">
            NO
          </div>
        </motion.div>

        {/* SKIP Overlay */}
        <motion.div 
          className="absolute inset-0 bg-purple-500/30 flex items-center justify-center"
          style={{ opacity: skipOverlay }}
        >
          <div className="text-4xl font-bold text-purple-400 border-4 border-purple-400 px-8 py-4 rounded-2xl flex items-center gap-3">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            SKIP
          </div>
        </motion.div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-between p-6 z-10">
          {/* Top Section - Odds and Timer */}
          <div className="space-y-3">
            {/* Countdown Timer */}
            <div className="flex justify-center">
              <div className="bg-black/40 backdrop-blur-md border border-gray-500/30 rounded-2xl px-4 py-2">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-bold text-white">
                    {timeRemaining}
                  </span>
                </div>
              </div>
            </div>

            {/* Odds */}
            <div className="flex justify-between items-start gap-4">
              <div className="bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-2xl px-4 py-2">
                <div className="text-xs text-red-400 font-medium">NO</div>
                <div className="text-lg font-bold text-red-300">{card.noOdds}</div>
              </div>
              <div className="bg-green-500/20 backdrop-blur-md border border-green-500/30 rounded-2xl px-4 py-2">
                <div className="text-xs text-green-400 font-medium">YES</div>
                <div className="text-lg font-bold text-green-300">{card.yesOdds}</div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Question */}
          <div className="space-y-4">
            {/* Market ID Badge */}
            <div className="inline-block bg-purple-500/20 backdrop-blur-md border border-purple-500/30 rounded-full px-3 py-1">
              <span className="text-xs text-purple-300 font-medium">Market #{card.id}</span>
            </div>
            
            <h2 className="text-2xl font-bold text-white leading-tight">
              {card.question}
            </h2>
            
            {/* Swipe Instructions */}
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2 text-red-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Swipe for NO</span>
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <span>Swipe for YES</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

