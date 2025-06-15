
import React from 'react';
import { Heart, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { tokens } from '../data/tokens';

interface LikedPageProps {
  likedTokens: number[];
}

const LikedPage: React.FC<LikedPageProps> = ({ likedTokens }) => {
  const likedTokenData = tokens.filter(token => likedTokens.includes(token.id));

  if (likedTokens.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mb-6">
          <Heart className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Liked Tokens Yet</h2>
        <p className="text-gray-600">Start swiping right on tokens you love to build your collection!</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart className="w-6 h-6 text-red-500 fill-current" />
          <h1 className="text-2xl font-bold text-gray-900">Your Liked Tokens</h1>
        </div>
        <p className="text-gray-600">{likedTokens.length} token{likedTokens.length !== 1 ? 's' : ''} liked</p>
      </div>

      <div className="space-y-3">
        {likedTokenData.map((token) => (
          <Card key={token.id} className="p-4 bg-white border-0 shadow-md">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <img
                  src={token.image}
                  alt={token.name}
                  className="w-16 h-16 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=100&h=100&fit=crop';
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-gray-900">{token.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    token.status === 'presale' 
                      ? 'bg-orange-100 text-orange-600' 
                      : 'bg-green-100 text-green-600'
                  }`}>
                    {token.status === 'presale' ? 'PRESALE' : 'LAUNCHED'}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{token.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="font-semibold text-green-600">{token.price}</span>
                    <div className="flex items-center gap-1 text-red-500">
                      <Heart className="w-3 h-3 fill-current" />
                      <span>{token.likes}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(`https://${token.website}`, '_blank')}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Site
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LikedPage;
