
import React from 'react';
import { X, ExternalLink, Heart, TrendingUp, Users, Globe } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface Token {
  id: number;
  name: string;
  creator: string;
  price: string;
  image: string;
  color: string;
  description: string;
  website: string;
  twitter: string;
  marketCap?: string;
  volume24h?: string;
  holders?: string;
  likes: number;
  status: 'presale' | 'launched';
  progress?: number;
}

interface TokenDetailModalProps {
  token: Token;
  isOpen: boolean;
  onClose: () => void;
}

const TokenDetailModal: React.FC<TokenDetailModalProps> = ({ token, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white rounded-lg overflow-hidden">
        <div className="relative">
          <img 
            src={token.image} 
            alt={token.name}
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop';
            }}
          />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/90 transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>

          <div className="absolute top-4 left-4">
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
              token.status === 'presale' 
                ? 'bg-orange-500 text-white' 
                : 'bg-green-500 text-white'
            }`}>
              {token.status === 'presale' ? 'PRESALE' : 'LAUNCHED'}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900">{token.name}</h3>
            <div className="flex items-center gap-1 text-red-500">
              <Heart className="w-4 h-4 fill-current" />
              <span className="font-semibold">{token.likes}</span>
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-1">Creator</div>
            <div className="font-mono text-sm text-gray-700">{token.creator}</div>
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-1">Description</div>
            <p className="text-gray-600 text-sm leading-relaxed">{token.description}</p>
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-1">Price</div>
            <div className={`text-xl font-bold ${token.status === 'presale' ? 'text-orange-600' : 'text-green-600'}`}>
              {token.price}
            </div>
          </div>

          {token.status === 'presale' && token.progress !== null && (
            <div>
              <div className="text-sm text-gray-500 mb-2">Presale Progress</div>
              <Progress value={token.progress} className="h-3" />
              <div className="text-right text-sm text-gray-600 mt-1">{token.progress}%</div>
              <Button className="w-full mt-3 bg-orange-500 hover:bg-orange-600">
                Buy Shares
              </Button>
            </div>
          )}

          {token.status === 'launched' && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-500">Market Cap</span>
                </div>
                <div className="font-semibold">{token.marketCap}</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-500" />
                  <span className="text-gray-500">Holders</span>
                </div>
                <div className="font-semibold">{token.holders}</div>
              </div>
              <div className="col-span-2 space-y-2">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-green-500" />
                  <span className="text-gray-500">24h Volume</span>
                </div>
                <div className="font-semibold">{token.volume24h}</div>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => window.open(`https://${token.website}`, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Website
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => window.open(`https://twitter.com/${token.twitter}`, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Twitter
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TokenDetailModal;
