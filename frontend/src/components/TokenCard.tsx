
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Heart, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface TokenCardProps {
  token: any;
  index: number;
  showMarketCap?: boolean;
  onTokenClick: (token: any) => void;
  onBuyShares: (tokenId: number, e: React.MouseEvent) => void;
  getTokenCurrentStatus: (token: any) => string;
  getTokenCurrentProgress: (token: any) => number;
  getTokenShares: (tokenId: number) => number;
}

const TokenCard: React.FC<TokenCardProps> = ({
  token,
  index,
  showMarketCap = false,
  onTokenClick,
  onBuyShares,
  getTokenCurrentStatus,
  getTokenCurrentProgress,
  getTokenShares
}) => {
  const currentStatus = getTokenCurrentStatus(token);
  const currentProgress = getTokenCurrentProgress(token);
  const shares = getTokenShares(token.id);
  const isFresh = token.likes < 80;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Trophy className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Trophy className="w-5 h-5 text-amber-600" />;
      default:
        return <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">{rank}</div>;
    }
  };

  const getBadgeInfo = () => {
    if (isFresh) {
      return {
        text: 'FRESH',
        className: 'bg-cyan-100 text-cyan-600'
      };
    } else if (currentStatus === 'presale') {
      return {
        text: 'PRESALE',
        className: 'bg-orange-100 text-orange-600'
      };
    } else {
      return {
        text: 'LAUNCHED',
        className: 'bg-green-100 text-green-600'
      };
    }
  };

  const badgeInfo = getBadgeInfo();

  return (
    <Card 
      className="p-4 bg-white border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-all duration-200 rounded-xl"
      onClick={() => onTokenClick(token)}
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          {getRankIcon(index + 1)}
        </div>
        
        <div className="flex-shrink-0">
          <img
            src={token.image}
            alt={token.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=100&h=100&fit=crop';
            }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 text-sm">{token.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${badgeInfo.className}`}>
                {badgeInfo.text}
              </span>
            </div>
            <div className="flex items-center gap-1 text-red-500">
              <Heart className="w-4 h-4 fill-current" />
              <span className="font-semibold text-sm">{token.likes}</span>
            </div>
          </div>

          <p className="text-xs text-gray-600 truncate mb-2">{token.description}</p>

          {/* Launched tokens */}
          {currentStatus === 'launched' && !isFresh && (
            <>
              <div className="flex items-center gap-4 mb-2 text-xs text-gray-500">
                <span className="font-medium text-green-600">{token.price}</span>
                {showMarketCap && token.marketCap && (
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {token.marketCap}
                  </span>
                )}
              </div>
              
              {shares > 0 && (
                <div className="text-xs text-emerald-600 font-medium mb-2">
                  Your tokens: {shares}
                </div>
              )}
              
              <Button 
                onClick={(e) => onBuyShares(token.id, e)}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white text-xs py-1 h-6"
              >
                Buy Tokens
              </Button>
            </>
          )}

          {/* Presale tokens - only show likes and progress */}
          {currentStatus === 'presale' && !isFresh && (
            <div className="space-y-2">
              <Progress value={currentProgress} className="h-2" />
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">{currentProgress}% funded</span>
                {shares > 0 && (
                  <span className="text-amber-600 font-medium">Your tokens: {shares}</span>
                )}
              </div>
              <Button 
                onClick={(e) => onBuyShares(token.id, e)}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs py-1 h-6"
                disabled={currentProgress >= 100}
              >
                {currentProgress >= 100 ? 'Presale Complete' : 'Buy Tokens'}
              </Button>
            </div>
          )}

          {/* Fresh tokens */}
          {isFresh && (
            <div className="text-xs text-cyan-600 font-medium">
              New token! Needs 80+ likes to enter presale.
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TokenCard;
