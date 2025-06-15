
import React from 'react';
import { Card } from '@/components/ui/card';
import { Rocket } from 'lucide-react';
import TokenCard from './TokenCard';

interface LeaderboardSectionProps {
  title: string;
  subtitle: string;
  emoji: string;
  tokens: any[];
  showMarketCap?: boolean;
  onTokenClick: (token: any) => void;
  onBuyShares: (tokenId: number, e: React.MouseEvent) => void;
  getTokenCurrentStatus: (token: any) => string;
  getTokenCurrentProgress: (token: any) => number;
  getTokenShares: (tokenId: number) => number;
}

const LeaderboardSection: React.FC<LeaderboardSectionProps> = ({
  title,
  subtitle,
  emoji,
  tokens,
  showMarketCap = false,
  onTokenClick,
  onBuyShares,
  getTokenCurrentStatus,
  getTokenCurrentProgress,
  getTokenShares
}) => {
  return (
    <div className="mb-6">
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold text-gray-900 mb-1">{emoji} {title}</h2>
        <p className="text-gray-600 text-sm">{subtitle}</p>
      </div>

      {tokens.length > 0 ? (
        <div className="space-y-2">
          {tokens.map((token, index) => (
            <TokenCard 
              key={token.id} 
              token={token} 
              index={index} 
              showMarketCap={showMarketCap}
              onTokenClick={onTokenClick}
              onBuyShares={onBuyShares}
              getTokenCurrentStatus={getTokenCurrentStatus}
              getTokenCurrentProgress={getTokenCurrentProgress}
              getTokenShares={getTokenShares}
            />
          ))}
        </div>
      ) : (
        <Card className="p-6 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-100 rounded-xl">
          <div className="text-center">
            <Rocket className="w-10 h-10 text-orange-500 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 mb-2 text-sm">No presale tokens ready yet!</h3>
            <p className="text-gray-600 text-xs">Tokens need 80+ likes to be ready for launch</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default LeaderboardSection;
