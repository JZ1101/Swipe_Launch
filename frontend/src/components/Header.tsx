
import React from 'react';
import { Coins, Zap, Heart, User } from 'lucide-react';

interface HeaderProps {
  credits: number;
  slTokenBalance: number;
  onCreditsClick: () => void;
  onLikedClick: () => void;
  onPortfolioClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  credits, 
  slTokenBalance, 
  onCreditsClick, 
  onLikedClick, 
  onPortfolioClick 
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex justify-between items-center max-w-md mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="text-xl font-bold text-gray-900">SwipeLaunch</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onPortfolioClick}
            className="flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-full hover:bg-purple-100 transition-colors"
          >
            <User className="w-4 h-4 text-purple-500" />
          </button>
          
          <button
            onClick={onLikedClick}
            className="flex items-center gap-1 bg-red-50 px-2 py-1 rounded-full hover:bg-red-100 transition-colors"
          >
            <Heart className="w-4 h-4 text-red-500 fill-current" />
          </button>
          
          <button
            onClick={onCreditsClick}
            className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full hover:bg-yellow-100 transition-colors"
          >
            <Zap className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-semibold text-yellow-800">{credits}</span>
          </button>
          
          <div className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full">
            <Coins className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-800">{slTokenBalance} SL</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
