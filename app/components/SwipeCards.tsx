'use client';

import { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useAccount } from 'wagmi';

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
  const { address, isConnected } = useAccount();

  const currentCard = cards[currentIndex];

  const handleSwipe = (direction: 'left' | 'right') => {
    if (!isConnected) {
      alert('Please connect your wallet to predict');
      return;
    }

    const prediction = direction === 'right' ? 'YES' : 'NO';
    console.log(`Predicted ${prediction} for: ${currentCard.question}`);
    
    // Move to next card
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Reset to beginning
      setCurrentIndex(0);
    }
  };

  if (!currentCard) return null;

  return (
    <div className="relative w-full max-w-sm h-[500px]">
      {/* Stack of cards preview */}
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
            <SwipeCard card={card} onSwipe={handleSwipe} />
          ) : (
            <div className="w-full h-full rounded-3xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50" />
          )}
        </div>
      ))}
    </div>
  );
}

function SwipeCard({ 
  card, 
  onSwipe 
}: { 
  card: typeof predictions[0]; 
  onSwipe: (direction: 'left' | 'right') => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event: any, info: any) => {
    if (Math.abs(info.offset.x) > 100) {
      const direction = info.offset.x > 0 ? 'right' : 'left';
      onSwipe(direction);
    }
  };

  // Show overlay based on swipe direction
  const yesOverlay = useTransform(x, [0, 100], [0, 1]);
  const noOverlay = useTransform(x, [-100, 0], [1, 0]);

  return (
    <motion.div
      className="w-full h-full cursor-grab active:cursor-grabbing"
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: 'grabbing' }}
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

        {/* Content */}
        <div className="relative h-full flex flex-col justify-between p-6 z-10">
          {/* Top Section - Odds */}
          <div className="flex justify-between items-start gap-4">
            <div className="bg-green-500/20 backdrop-blur-md border border-green-500/30 rounded-2xl px-4 py-2">
              <div className="text-xs text-green-400 font-medium">YES</div>
              <div className="text-lg font-bold text-green-300">{card.yesOdds}</div>
            </div>
            <div className="bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-2xl px-4 py-2">
              <div className="text-xs text-red-400 font-medium">NO</div>
              <div className="text-lg font-bold text-red-300">{card.noOdds}</div>
            </div>
          </div>

          {/* Bottom Section - Question */}
          <div className="space-y-4">
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

