import React, { useState, useEffect } from 'react';
import SwipeCard from './SwipeCard';
import NewsTicker from './NewsTicker';
import { tokens } from '../data/tokens';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DiscoverPageProps {
  credits: number;
  onSwipe: (direction: 'left' | 'right', tokenId: number) => void;
  onCreditsUsed: () => void;
}

const DiscoverPage: React.FC<DiscoverPageProps> = ({ credits, onSwipe, onCreditsUsed }) => {
  const [currentTokenIndex, setCurrentTokenIndex] = useState(0);
  const [shuffledTokens, setShuffledTokens] = useState<typeof tokens>([]);

  const initializeTokens = () => {
    // Show ALL tokens in discover page
    const allTokens = [...tokens];
    const shuffled = allTokens.sort(() => Math.random() - 0.5);
    setShuffledTokens(shuffled);
    setCurrentTokenIndex(0);
  };

  useEffect(() => {
    initializeTokens();
  }, []);

  const handleSwipe = (direction: 'left' | 'right', tokenId: number) => {
    // Only likes cost credits, passes are free
    if (direction === 'right') {
      if (credits <= 0) {
        return; // Prevent like if no credits
      }
      onCreditsUsed(); // Use credit only for likes
    }
    
    onSwipe(direction, tokenId);
    setCurrentTokenIndex(prev => prev + 1);
  };

  const resetStack = () => {
    initializeTokens();
  };

  const currentToken = shuffledTokens[currentTokenIndex];

  if (currentTokenIndex >= shuffledTokens.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gradient-to-br from-neutral-50 to-stone-100 pb-24">
        <div className="w-20 h-20 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
          <RefreshCw className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-stone-800 mb-2">You've seen them all!</h2>
        <p className="text-stone-600 mb-6">No more tokens to discover right now.</p>
        <div className="fixed bottom-20 left-0 right-0 max-w-md mx-auto p-4">
          <Button onClick={resetStack} className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 shadow-lg">
            <RefreshCw className="w-4 h-4 mr-2" />
            Start Over
          </Button>
        </div>
      </div>
    );
  }

  if (!currentToken) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-neutral-50 to-stone-100">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-stone-600">Loading tokens...</p>
        </div>
      </div>
    );
  }

  const canLike = credits > 0;

  return (
    <div className="flex flex-col min-h-full bg-gradient-to-br from-neutral-50 to-stone-100 pb-24">
      <NewsTicker />
      
      <div className="flex flex-col items-center justify-center flex-1 p-4">
        <div className="mb-4 text-center">
          <p className="text-sm text-stone-500">
            {currentTokenIndex + 1} of {shuffledTokens.length}
          </p>
          <p className="text-xs text-stone-600 font-medium mt-1">
            Likes cost 1 credit • Passes are free • Credits: {credits}
          </p>
        </div>

        <SwipeCard 
          token={currentToken} 
          onSwipe={handleSwipe}
          canSwipe={true}
        />
        
        {!canLike && (
          <div className="fixed bottom-20 left-0 right-0 max-w-md mx-auto p-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
              <p className="text-amber-700 text-sm font-medium">
                No credits left for likes! You can still pass for free.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoverPage;
