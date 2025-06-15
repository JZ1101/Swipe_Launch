
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Wallet, Clock, Upload, Plus } from 'lucide-react';
import { tokens } from '../data/tokens';

interface PortfolioItem {
  tokenId: number;
  tokenName: string;
  shares: number;
  totalInvested: number;
  purchasePrice: number;
  status: 'presale' | 'launched';
  purchaseDate: string;
}

interface UploadedToken {
  id: string;
  name: string;
  description: string;
  image: string;
  likes: number;
  status: 'presale' | 'launched';
  uploadDate: string;
  poolAmount: number;
  targetPool: number;
}

interface PortfolioPageProps {
  onUploadClick: () => void;
}

const PortfolioPage: React.FC<PortfolioPageProps> = ({ onUploadClick }) => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [uploadedTokens, setUploadedTokens] = useState<UploadedToken[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [totalInvested, setTotalInvested] = useState(0);

  useEffect(() => {
    // Load portfolio from localStorage
    const savedPortfolio = JSON.parse(localStorage.getItem('userPortfolio') || '[]');
    setPortfolio(savedPortfolio);

    // Load uploaded tokens from localStorage
    const savedUploads = JSON.parse(localStorage.getItem('userUploads') || '[]');
    setUploadedTokens(savedUploads);

    // Calculate totals
    const invested = savedPortfolio.reduce((sum: number, item: PortfolioItem) => sum + item.totalInvested, 0);
    setTotalInvested(invested);
    
    // For now, set current value same as invested (would be dynamic in real app)
    setTotalValue(invested * 1.15); // Simulate 15% gain
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getTokenCurrentPrice = (tokenId: number, status: string) => {
    const token = tokens.find(t => t.id === tokenId);
    if (!token) return 'N/A';
    return status === 'presale' ? '0.01 SOL' : token.price;
  };

  const getTokenImage = (tokenId: number) => {
    const token = tokens.find(t => t.id === tokenId);
    return token?.image || 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=100&h=100&fit=crop';
  };

  const profitLoss = totalValue - totalInvested;
  const profitLossPercentage = totalInvested > 0 ? ((profitLoss / totalInvested) * 100) : 0;

  return (
    <div className="p-4 space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Portfolio</h1>
        <p className="text-gray-600">Track your investments and projects</p>
      </div>

      {/* Portfolio Summary */}
      <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-0 shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Portfolio Value</h2>
            <p className="text-gray-600">Your investment performance</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/60 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Total Value</div>
            <div className="text-2xl font-bold text-gray-900">${totalValue.toFixed(2)}</div>
          </div>
          <div className="bg-white/60 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Total Invested</div>
            <div className="text-2xl font-bold text-gray-900">${totalInvested.toFixed(2)}</div>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-white/60 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">Profit/Loss</div>
            <div className={`flex items-center gap-2 ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {profitLoss >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="font-bold">
                ${Math.abs(profitLoss).toFixed(2)} ({Math.abs(profitLossPercentage).toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Holdings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">My Holdings</h3>
        {portfolio.length === 0 ? (
          <Card className="p-8 text-center bg-gray-50">
            <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No investments yet</h3>
            <p className="text-gray-600">Start swiping and investing in tokens to build your portfolio</p>
          </Card>
        ) : (
          portfolio.map((item, index) => (
            <Card key={index} className="p-4 bg-white border-0 shadow-md">
              <div className="flex items-center gap-4">
                <img
                  src={getTokenImage(item.tokenId)}
                  alt={item.tokenName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{item.tokenName}</h4>
                    <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                      item.status === 'presale' 
                        ? 'bg-amber-100 text-amber-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {item.status.toUpperCase()}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Tokens</div>
                      <div className="font-semibold">{item.shares}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Invested</div>
                      <div className="font-semibold">${item.totalInvested.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Price</div>
                      <div className="font-semibold">{getTokenCurrentPrice(item.tokenId, item.status)}</div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Purchased on {formatDate(item.purchaseDate)}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* My Projects */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">My Projects</h3>
          <Button
            onClick={onUploadClick}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Token
          </Button>
        </div>
        
        {uploadedTokens.length === 0 ? (
          <Card className="p-8 text-center bg-gray-50">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects created</h3>
            <p className="text-gray-600 mb-4">Create your first meme coin project</p>
            <Button onClick={onUploadClick} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Create Token
            </Button>
          </Card>
        ) : (
          uploadedTokens.map((token, index) => (
            <Card key={index} className="p-4 bg-white border-0 shadow-md">
              <div className="flex items-center gap-4">
                <img
                  src={token.image || 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=100&h=100&fit=crop'}
                  alt={token.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{token.name}</h4>
                    <div className="px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                      CREATOR
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Likes</div>
                      <div className="font-semibold">{token.likes || 0}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Pool</div>
                      <div className="font-semibold">{token.poolAmount || 0} / {token.targetPool || 100} SOL</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Status</div>
                      <div className="font-semibold capitalize">{token.status || 'presale'}</div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Created on {formatDate(token.uploadDate)}
                  </div>
                  {token.status === 'presale' && (
                    <div className="mt-2 bg-gray-100 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((token.poolAmount || 0) / (token.targetPool || 100)) * 100}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default PortfolioPage;
