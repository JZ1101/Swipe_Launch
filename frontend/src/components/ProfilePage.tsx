import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Plus, Calendar, Palette, TrendingUp, Wallet, Sparkles, Users } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { tokens } from '../data/tokens';
import { getLikes, addLike } from '../utils/likeManager';
import { useToast } from '@/hooks/use-toast';
import { calculateProgress, getPresaleStatus } from '../utils/presaleProgress';

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
  progress?: number;
  investorCount?: number;
  totalInvested?: number;
  purchases?: any[];
}

interface PortfolioItem {
  tokenId: number;
  tokenName: string;
  shares: number;
  totalInvested: number;
  purchasePrice: number;
  status: 'presale' | 'launched';
  purchaseDate: string;
}

interface ProfilePageProps {
  onCreateClick: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onCreateClick }) => {
  const [uploadedTokens, setUploadedTokens] = useState<UploadedToken[]>([]);
  const [totalLikes, setTotalLikes] = useState(0);
  const [likedTokens, setLikedTokens] = useState<number[]>([]);
  const [likedTokensData, setLikedTokensData] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [showPresaleNotification, setShowPresaleNotification] = useState(false);
  const [presaleTokenName, setPresaleTokenName] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('userUploads') || '[]');
    
    // Auto-set likes to 80 and calculate real progress for user uploaded tokens
    const updatedTokens = saved.map((token: UploadedToken) => {
      const currentLikes = token.likes || 0;
      const { progress, status } = getPresaleStatus(token);
      
      if (currentLikes < 80) {
        // Show presale notification for newly reached tokens
        if (currentLikes < 80 && !token.status || token.status !== 'presale') {
          setPresaleTokenName(token.name);
          setShowPresaleNotification(true);
          setTimeout(() => setShowPresaleNotification(false), 4000);
          
          toast({
            title: "🎉 Presale Ready!",
            description: `${token.name} has reached 80 likes and is now ready for presale!`,
          });
        }
        
        return {
          ...token,
          likes: 80,
          status: status as 'presale' | 'launched',
          progress: progress,
          poolAmount: token.poolAmount || 0,
          targetPool: token.targetPool || 100,
          investorCount: token.investorCount || 0,
          totalInvested: token.totalInvested || 0
        };
      }
      
      return {
        ...token,
        progress: progress,
        status: status as 'presale' | 'launched',
        investorCount: token.investorCount || 0,
        totalInvested: token.totalInvested || 0
      };
    });
    
    setUploadedTokens(updatedTokens);
    
    // Update localStorage with new progress data
    localStorage.setItem('userUploads', JSON.stringify(updatedTokens));
    
    // Calculate total likes from uploaded tokens
    const likes = updatedTokens.reduce((sum: number, token: UploadedToken) => sum + (token.likes || 0), 0);
    setTotalLikes(likes);

    // Load liked tokens from localStorage
    const likedSaved = JSON.parse(localStorage.getItem('likedTokens') || '[]');
    setLikedTokens(likedSaved);
    
    // Get the actual token data for liked tokens with current likes
    const likedData = tokens.filter(token => likedSaved.includes(token.id)).map(token => ({
      ...token,
      currentLikes: getLikes(token.id),
      isPresaleReady: getLikes(token.id) >= 80
    }));
    setLikedTokensData(likedData);

    // Load portfolio from localStorage
    const savedPortfolio = JSON.parse(localStorage.getItem('userPortfolio') || '[]');
    setPortfolio(savedPortfolio);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getTokenImage = (tokenId: number) => {
    const token = tokens.find(t => t.id === tokenId);
    return token?.image || 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=100&h=100&fit=crop';
  };

  const getTokenCurrentPrice = (tokenId: number, status: string) => {
    const token = tokens.find(t => t.id === tokenId);
    if (!token) return 'N/A';
    return status === 'presale' ? '0.01 SOL' : token.price;
  };

  // Separate liked tokens into categories
  const presaleReadyTokens = likedTokensData.filter(token => token.isPresaleReady && token.status === 'presale');
  const launchedLikedTokens = likedTokensData.filter(token => token.isPresaleReady && token.status === 'launched');
  const freshLikedTokens = likedTokensData.filter(token => !token.isPresaleReady);

  return (
    <div className="p-4 space-y-6">
      {/* Flashing Presale Notification */}
      {showPresaleNotification && (
        <div className="fixed top-20 left-4 right-4 z-50 animate-pulse">
          <Card className="p-4 bg-gradient-to-r from-amber-400 to-orange-500 border-0 shadow-2xl">
            <div className="flex items-center gap-3 text-white">
              <Sparkles className="w-6 h-6 animate-spin" />
              <div>
                <h3 className="font-bold text-lg">🎉 PRESALE READY!</h3>
                <p className="text-sm">{presaleTokenName} reached 80 likes!</p>
              </div>
              <Sparkles className="w-6 h-6 animate-spin" />
            </div>
          </Card>
        </div>
      )}

      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Palette className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">Creator dashboard</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center bg-gradient-to-br from-pink-50 to-purple-50">
          <div className="text-xl font-bold text-gray-900">{uploadedTokens.length}</div>
          <div className="text-xs text-gray-600">Created</div>
        </Card>
        <Card className="p-4 text-center bg-gradient-to-br from-red-50 to-pink-50">
          <div className="text-xl font-bold text-gray-900 flex items-center justify-center gap-1">
            <Heart className="w-4 h-4 text-red-500" />
            {totalLikes}
          </div>
          <div className="text-xs text-gray-600">Earned</div>
        </Card>
        <Card className="p-4 text-center bg-gradient-to-br from-blue-50 to-cyan-50">
          <div className="text-xl font-bold text-gray-900">{likedTokens.length}</div>
          <div className="text-xs text-gray-600">Liked</div>
        </Card>
      </div>

      {/* Create Button */}
      <Card className="p-6 text-center bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
        <Plus className="w-12 h-12 text-amber-600 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-amber-900 mb-2">Create New Project</h3>
        <Button
          onClick={onCreateClick}
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Token
        </Button>
      </Card>

      {/* My Holdings */}
      {portfolio.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">My Holdings</h3>
          
          <div className="grid grid-cols-1 gap-4">
            {portfolio.map((item, index) => (
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
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Presale Ready Tokens */}
      {presaleReadyTokens.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">💎 Presale Ready (80+ likes)</h3>
          
          <div className="grid grid-cols-2 gap-4">
            {presaleReadyTokens.map((token) => (
              <Card key={token.id} className="overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow">
                <div className="aspect-square relative">
                  <img
                    src={token.image}
                    alt={token.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=200&h=200&fit=crop';
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                    <Heart className="w-3 h-3 text-red-500 fill-current" />
                    <span className="text-xs font-semibold">{token.currentLikes}</span>
                  </div>
                  <div className="absolute top-2 left-2">
                    <div className="px-2 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                      PRESALE
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-semibold text-gray-900 text-sm mb-2 truncate">{token.name}</h4>
                  <div className="space-y-2">
                    <Progress value={token.progress || 0} className="h-2" />
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500">{token.progress || 0}% funded</span>
                      <span className="text-amber-600 font-medium">0.01 SOL</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Launched Liked Tokens */}
      {launchedLikedTokens.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">🚀 Launched Favorites</h3>
          
          <div className="grid grid-cols-2 gap-4">
            {launchedLikedTokens.map((token) => (
              <Card key={token.id} className="overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow">
                <div className="aspect-square relative">
                  <img
                    src={token.image}
                    alt={token.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=200&h=200&fit=crop';
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                    <Heart className="w-3 h-3 text-red-500 fill-current" />
                    <span className="text-xs font-semibold">{token.currentLikes}</span>
                  </div>
                  <div className="absolute top-2 left-2">
                    <div className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                      LAUNCHED
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-semibold text-gray-900 text-sm mb-1 truncate">{token.name}</h4>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="font-semibold text-green-600">{token.price}</div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>{token.marketCap}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Fresh Liked Tokens */}
      {freshLikedTokens.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">❤️ Fresh Likes (Need 80+ for presale)</h3>
          
          <div className="grid grid-cols-2 gap-4">
            {freshLikedTokens.map((token) => (
              <Card key={token.id} className="overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow">
                <div className="aspect-square relative">
                  <img
                    src={token.image}
                    alt={token.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=200&h=200&fit=crop';
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                    <Heart className="w-3 h-3 text-red-500 fill-current" />
                    <span className="text-xs font-semibold">{token.currentLikes}/80</span>
                  </div>
                  <div className="absolute top-2 left-2">
                    <div className="px-2 py-1 rounded-full text-xs font-bold bg-cyan-100 text-cyan-700">
                      FRESH
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-semibold text-gray-900 text-sm mb-1 truncate">{token.name}</h4>
                  <div className="text-xs text-cyan-600 font-medium">
                    {80 - token.currentLikes} more likes needed
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No liked tokens message */}
      {likedTokensData.length === 0 && (
        <Card className="p-8 text-center bg-gray-50">
          <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No liked tokens yet</h3>
          <p className="text-gray-600">Start swiping right to build your collection</p>
        </Card>
      )}

      {/* My Artwork Gallery - Enhanced with Progress */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">My Artwork</h3>
        
        {uploadedTokens.length === 0 ? (
          <Card className="p-8 text-center bg-gray-50">
            <Palette className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No artwork yet</h3>
            <p className="text-gray-600">Create your first meme coin project</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {uploadedTokens.map((token) => (
              <Card key={token.id} className="overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow">
                <div className="flex">
                  {/* Token Image */}
                  <div className="w-24 h-24 relative flex-shrink-0">
                    <img
                      src={token.image || 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=200&h=200&fit=crop'}
                      alt={token.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 right-1 bg-white/90 backdrop-blur-sm px-1 py-0.5 rounded-full flex items-center gap-1">
                      <Heart className="w-2 h-2 text-red-500 fill-current" />
                      <span className="text-xs font-semibold">{token.likes || 0}</span>
                    </div>
                  </div>
                  
                  {/* Token Details */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">{token.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {formatDate(token.uploadDate)}
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                        token.status === 'presale' 
                          ? 'bg-amber-100 text-amber-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {token.status.toUpperCase()}
                      </div>
                    </div>

                    {/* Progress Section */}
                    {token.status === 'presale' && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-600">Progress to Launch</span>
                          <span className="font-semibold text-amber-600">
                            {(token.progress || 0).toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={token.progress || 0} className="h-2" />
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center">
                            <div className="font-semibold text-gray-900">{(token.poolAmount || 0).toFixed(1)}</div>
                            <div className="text-gray-500">SOL Raised</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-gray-900">{token.targetPool || 100}</div>
                            <div className="text-gray-500">SOL Target</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-gray-900 flex items-center justify-center gap-1">
                              <Users className="w-3 h-3" />
                              {token.investorCount || 0}
                            </div>
                            <div className="text-gray-500">Investors</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Launched Status */}
                    {token.status === 'launched' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-green-600 font-semibold">🚀 Successfully Launched!</span>
                          <span className="text-gray-600">Total Raised: {(token.totalInvested || 0).toFixed(1)} SOL</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="text-center bg-green-50 p-2 rounded">
                            <div className="font-semibold text-green-900">{token.investorCount || 0}</div>
                            <div className="text-green-600">Total Investors</div>
                          </div>
                          <div className="text-center bg-green-50 p-2 rounded">
                            <div className="font-semibold text-green-900">100%</div>
                            <div className="text-green-600">Funded</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
