import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Zap } from 'lucide-react';
import TokenDetailModal from './TokenDetailModal';
import TokenCard from './TokenCard';
import PurchaseConfirmationDialog from './PurchaseConfirmationDialog';
import LeaderboardSection from './LeaderboardSection';
import { randomizeTokenStatus, mergeTokenData } from '../utils/tokenUtils';
import { getLikes, getAllLikes } from '../utils/likeManager';
import { rawTokens } from '../data/rawTokens';

const LeaderboardPage: React.FC = () => {
  const [currentTokens, setCurrentTokens] = useState(() => mergeTokenData());
  const [selectedToken, setSelectedToken] = useState(null);
  const [tokenShares, setTokenShares] = useState<Record<number, number>>({});
  const [tokenProgress, setTokenProgress] = useState<Record<number, number>>({});
  const [tokenStatus, setTokenStatus] = useState<Record<number, 'presale' | 'launched'>>({});
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmTokenId, setConfirmTokenId] = useState<number | null>(null);

  const handleRandomizeStatus = () => {
    const newStatus = randomizeTokenStatus();
    const newTokens = mergeTokenData(newStatus);
    setCurrentTokens(newTokens);
    
    // Reset local state for new tokens
    setTokenShares({});
    setTokenProgress({});
    setTokenStatus({});
  };

  const handleSimulatePresale = () => {
    // Move fresh tokens (80+ likes) to presale status
    const updatedTokens = currentTokens.map(token => {
      const currentLikes = getLikes(token.id);
      if (currentLikes >= 80 && token.status === 'launched' && currentLikes < 150) {
        return { ...token, status: 'presale', progress: Math.floor(Math.random() * 30) + 10 };
      }
      return token;
    });
    
    setCurrentTokens(updatedTokens);
    console.log('Moved eligible tokens to presale status');
  };

  const handleBuyShares = (tokenId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const token = getCurrentToken(tokenId);
    const currentLikes = getLikes(tokenId);
    const isFresh = currentLikes < 80;
    
    // Don't allow buying fresh tokens
    if (isFresh) {
      console.log(`Cannot buy ${token?.name} - token needs 80+ likes to enter presale`);
      return;
    }
    
    setConfirmTokenId(tokenId);
    setIsConfirmOpen(true);
  };

  const handleConfirmPurchase = (amount: number) => {
    if (!confirmTokenId) return;
    
    const currentShares = tokenShares[confirmTokenId] || 0;
    const token = getCurrentToken(confirmTokenId);
    const currentTokenProgress = tokenProgress[confirmTokenId] || token?.progress || 0;
    const currentTokenStatus = getTokenCurrentStatus(token);
    
    if (currentTokenStatus === 'presale') {
      const newShares = currentShares + amount;
      const progressIncrement = amount; // 1 token = 1% progress toward 100 SOL goal
      const newProgress = Math.min(currentTokenProgress + progressIncrement, 100);
      
      setTokenShares(prev => ({ ...prev, [confirmTokenId]: newShares }));
      setTokenProgress(prev => ({ ...prev, [confirmTokenId]: newProgress }));
      
      if (newProgress >= 100) {
        setTokenStatus(prev => ({ ...prev, [confirmTokenId]: 'launched' }));
        console.log(`🚀 ${token?.name} has been launched! Presale goal reached (100 SOL). Total tokens purchased: ${newShares}`);
      } else {
        const solSpent = amount * 0.01;
        console.log(`Bought ${amount} tokens of ${token?.name} for ${solSpent.toFixed(2)} SOL. Total tokens: ${newShares} | Progress: ${newProgress}%`);
      }
    } else if (currentTokenStatus === 'launched') {
      const newShares = currentShares + amount;
      const tokenPrice = parseFloat(token?.price.replace('$', '') || '0');
      const totalCost = amount * tokenPrice;
      setTokenShares(prev => ({ ...prev, [confirmTokenId]: newShares }));
      console.log(`Bought ${amount} tokens of ${token?.name} for $${totalCost.toFixed(6)}. Total tokens: ${newShares}`);
    }
    
    setIsConfirmOpen(false);
    setConfirmTokenId(null);
  };

  const getCurrentToken = (tokenId: number) => {
    return currentTokens.find(t => t.id === tokenId);
  };

  const getTokenCurrentStatus = (token: any) => {
    return tokenStatus[token.id] || token.status;
  };

  const getTokenCurrentProgress = (token: any) => {
    return tokenProgress[token.id] !== undefined ? tokenProgress[token.id] : (token.progress || 0);
  };

  const getTokenCurrentLikes = (token: any) => {
    return getLikes(token.id);
  };

  const getTokenShares = (tokenId: number) => {
    return tokenShares[tokenId] || 0;
  };

  const getCurrentTokensWithUpdatedLikes = () => {
    return currentTokens.map(token => ({
      ...token,
      likes: getTokenCurrentLikes(token),
      isFresh: getTokenCurrentLikes(token) < 80
    }));
  };

  const tokensWithUpdatedLikes = getCurrentTokensWithUpdatedLikes();

  const launchedTokens = tokensWithUpdatedLikes
    .filter(token => getTokenCurrentStatus(token) === 'launched' && !token.isFresh && token.likes >= 80)
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 5);

  const presaleTokens = tokensWithUpdatedLikes
    .filter(token => getTokenCurrentStatus(token) === 'presale' && token.likes >= 80)
    .sort((a, b) => b.likes - a.likes);

  const confirmToken = confirmTokenId ? getCurrentToken(confirmTokenId) : null;

  return (
    <div className="p-4 space-y-6 pb-24">
      <LeaderboardSection
        title="Top 5 Launched"
        subtitle="Most liked launched meme coins"
        emoji="🚀"
        tokens={launchedTokens}
        showMarketCap={true}
        onTokenClick={setSelectedToken}
        onBuyShares={handleBuyShares}
        getTokenCurrentStatus={getTokenCurrentStatus}
        getTokenCurrentProgress={getTokenCurrentProgress}
        getTokenShares={getTokenShares}
      />

      <LeaderboardSection
        title="Presale Ready"
        subtitle="Meme coins with 80+ likes ready for launch"
        emoji="💎"
        tokens={presaleTokens}
        showMarketCap={false}
        onTokenClick={setSelectedToken}
        onBuyShares={handleBuyShares}
        getTokenCurrentStatus={getTokenCurrentStatus}
        getTokenCurrentProgress={getTokenCurrentProgress}
        getTokenShares={getTokenShares}
      />

      {/* Fixed buttons at bottom */}
      <div className="fixed bottom-20 left-0 right-0 max-w-md mx-auto p-4 bg-white border-t border-gray-200">
        <div className="flex gap-3">
          <Button 
            onClick={handleSimulatePresale} 
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            <Zap className="w-4 h-4 mr-2" />
            Move to Presale
          </Button>
          <Button 
            onClick={handleRandomizeStatus} 
            className="flex-1 bg-purple-500 hover:bg-purple-600"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="text-center mt-4 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
        <p className="text-sm text-gray-600">
          Rankings update in real-time based on user likes
        </p>
      </div>

      <PurchaseConfirmationDialog
        isOpen={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirmPurchase={handleConfirmPurchase}
        token={confirmToken}
        getTokenCurrentStatus={getTokenCurrentStatus}
      />

      <TokenDetailModal 
        token={selectedToken}
        isOpen={!!selectedToken}
        onClose={() => setSelectedToken(null)}
      />
    </div>
  );
};

export default LeaderboardPage;
