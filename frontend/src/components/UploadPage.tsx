import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Upload, Camera, Coins, Zap, CheckCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UploadPageProps {
  onComplete?: () => void;
}

const UploadPage: React.FC<UploadPageProps> = ({ onComplete }) => {
  const [tokenData, setTokenData] = useState({
    name: '',
    description: '',
    image: '',
  });
  const [uploading, setUploading] = useState(false);
  const [uploadedTokens, setUploadedTokens] = useState<any[]>([]);
  const { toast } = useToast();

  // Fixed presale parameters
  const PRESALE_PRICE = 0.01; // 0.01 SOL per token
  const TARGET_POOL = 100; // 100 SOL to launch
  const CREATOR_ADDRESS = "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"; // Auto-filled

  React.useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('userUploads') || '[]');
    setUploadedTokens(saved);
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setTokenData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTokenData(prev => ({ ...prev, image: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tokenData.name || !tokenData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const newToken = {
        id: Date.now().toString(),
        name: tokenData.name,
        description: tokenData.description,
        image: tokenData.image || 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=500&h=500&fit=crop',
        likes: 0,
        status: 'presale' as const,
        uploadDate: new Date().toISOString(),
        poolAmount: 0,
        targetPool: TARGET_POOL,
        creatorAddress: CREATOR_ADDRESS,
        presalePrice: PRESALE_PRICE,
      };

      const currentUploads = JSON.parse(localStorage.getItem('userUploads') || '[]');
      const updatedUploads = [...currentUploads, newToken];
      localStorage.setItem('userUploads', JSON.stringify(updatedUploads));
      setUploadedTokens(updatedUploads);

      // Simulate celebrity notification
      setTimeout(() => {
        const celebrities = ['Elon Musk', 'Vitalik Buterin', 'Mark Cuban', 'Michael Saylor'];
        const randomCelebrity = celebrities[Math.floor(Math.random() * celebrities.length)];
        
        const currentNotifications = JSON.parse(localStorage.getItem('fakeNotifications') || '[]');
        const newNotification = {
          id: Date.now(),
          celebrity: randomCelebrity,
          action: 'liked',
          tokenName: newToken.name,
          tokenId: parseInt(newToken.id),
          timestamp: new Date(),
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
        };
        
        localStorage.setItem('fakeNotifications', JSON.stringify([newNotification, ...currentNotifications]));
        
        toast({
          title: "🚀 Celebrity Alert!",
          description: `${randomCelebrity} just liked your ${newToken.name} project!`,
        });
      }, 3000);

      toast({
        title: "Token Created Successfully!",
        description: `${tokenData.name} is now in presale mode. Target: ${TARGET_POOL} SOL to launch!`,
      });

      // Reset form
      setTokenData({ name: '', description: '', image: '' });
      
      // Call onComplete callback
      if (onComplete) {
        setTimeout(() => {
          onComplete();
        }, 1500);
      }
      
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        {onComplete && (
          <Button variant="ghost" size="sm" onClick={onComplete}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
        <div className="text-center flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Your Token</h1>
          <p className="text-gray-600">Launch your meme coin project</p>
        </div>
      </div>

      {/* Presale Information */}
      <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
        <div className="flex items-center gap-3 mb-4">
          <Coins className="w-8 h-8 text-amber-600" />
          <div>
            <h3 className="text-lg font-bold text-amber-900">Presale Launch System</h3>
            <p className="text-amber-700">Your token will start in presale mode</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-white/60 p-4 rounded-lg">
            <div className="text-2xl font-bold text-amber-900">{PRESALE_PRICE} SOL</div>
            <div className="text-sm text-amber-600">Price per token</div>
          </div>
          <div className="bg-white/60 p-4 rounded-lg">
            <div className="text-2xl font-bold text-amber-900">{TARGET_POOL} SOL</div>
            <div className="text-sm text-amber-600">Launch target</div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-amber-100 rounded-lg">
          <p className="text-sm text-amber-800">
            <CheckCircle className="w-4 h-4 inline mr-2" />
            When {TARGET_POOL} SOL is raised, your token will automatically launch!
          </p>
        </div>
      </Card>

      {/* Upload Form */}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Token Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Token Image
            </label>
            <div className="flex flex-col items-center">
              {tokenData.image ? (
                <div className="relative">
                  <img
                    src={tokenData.image}
                    alt="Token preview"
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                  />
                  <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <label className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors group">
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mx-auto mb-1" />
                    <span className="text-sm text-gray-500 group-hover:text-blue-500">Upload Image</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Token Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Token Name *
            </label>
            <Input
              type="text"
              value={tokenData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g., DogeCoin, PepeCoin"
              className="w-full"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <Textarea
              value={tokenData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your meme coin project..."
              rows={4}
              className="w-full"
              required
            />
          </div>

          {/* Creator Address (Auto-filled) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Creator Address
            </label>
            <Input
              type="text"
              value={CREATOR_ADDRESS}
              readOnly
              className="w-full bg-gray-50 text-gray-600"
            />
            <p className="text-xs text-gray-500 mt-1">Automatically filled with your wallet address</p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={uploading || !tokenData.name || !tokenData.description}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3"
          >
            {uploading ? (
              <>
                <Zap className="w-5 h-5 mr-2 animate-spin" />
                Creating Token...
              </>
            ) : (
              <>
                <Coins className="w-5 h-5 mr-2" />
                Create Token
              </>
            )}
          </Button>
        </form>
      </Card>

      {/* Recent Uploads */}
      {uploadedTokens.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Recent Projects</h3>
          <div className="space-y-3">
            {uploadedTokens.slice(-3).reverse().map((token) => (
              <div key={token.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <img
                  src={token.image || 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=100&h=100&fit=crop'}
                  alt={token.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{token.name}</h4>
                  <p className="text-sm text-gray-600">
                    {token.poolAmount || 0} / {token.targetPool} SOL raised
                  </p>
                </div>
                <div className="text-sm font-medium text-amber-600">
                  {token.status === 'presale' ? 'PRESALE' : 'LAUNCHED'}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default UploadPage;
