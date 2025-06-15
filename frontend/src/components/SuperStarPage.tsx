
import React, { useState, useEffect } from 'react';
import SwipeCard from './SwipeCard';
import { tokens } from '../data/tokens';
import { RefreshCw, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SuperStarPageProps {
  credits: number;
  onSwipe: (direction: 'left' | 'right', tokenId: number) => void;
  onCreditsUsed: () => void;
}

const SuperStarPage: React.FC<SuperStarPageProps> = ({ credits, onSwipe, onCreditsUsed }) => {
  const [currentTokenIndex, setCurrentTokenIndex] = useState(0);
  const [shuffledTokens, setShuffledTokens] = useState<typeof tokens>([]);

  useEffect(() => {
    // Filter tokens with >80 likes regardless of status
    const superStarTokens = tokens.filter(token => token.likes > 80);
    const shuffled = [...superStarTokens].sort(() => Math.random() - 0.5);
    setShuffledTokens(shuffled);
    setCurrentTokenIndex(0);
  }, []);

  const handleSwipe = (direction: 'left' | 'right', tokenId: number) => {
    // Never spend credits for any swipe action
    onSwipe(direction, tokenId);
    setCurrentTokenIndex(prev => prev + 1);
  };

  const resetStack = () => {
    setCurrentTokenIndex(0);
    const superStarTokens = tokens.filter(token => token.likes > 80);
    const shuffled = [...superStarTokens].sort(() => Math.random() - 0.5);
    setShuffledTokens(shuffled);
  };

  const currentToken = shuffledTokens[currentTokenIndex];

  if (shuffledTokens.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gradient-to-br from-amber-50 to-orange-100">
        <div className="w-20 h-20 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
          <Star className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-stone-800 mb-2">No SuperStars Yet!</h2>
        <p className="text-stone-600 mb-6">No tokens have reached 80+ likes yet. Check back later!</p>
      </div>
    );
  }

  if (currentTokenIndex >= shuffledTokens.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gradient-to-br from-amber-50 to-orange-100">
        <div className="w-20 h-20 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
          <RefreshCw className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-stone-800 mb-2">All SuperStars Seen!</h2>
        <p className="text-stone-600 mb-6">You've seen all the SuperStar tokens.</p>
        <Button onClick={resetStack} className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 shadow-lg">
          <RefreshCw className="w-4 h-4 mr-2" />
          Start Over
        </Button>
      </div>
    );
  }

  if (!currentToken) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-amber-50 to-orange-100">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-stone-600">Loading SuperStars...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-4 bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="mb-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Star className="w-6 h-6 text-amber-500" />
          <h1 className="text-xl font-bold text-stone-800">SuperStar Tokens</h1>
          <Star className="w-6 h-6 text-amber-500" />
        </div>
        <p className="text-sm text-stone-600">
          {currentTokenIndex + 1} of {shuffledTokens.length} • 80+ likes required
        </p>
      </div>

      <SwipeCard 
        token={currentToken} 
        onSwipe={handleSwipe}
        canSwipe={true}
      />
    </div>
  );
};

export default SuperStarPage;
