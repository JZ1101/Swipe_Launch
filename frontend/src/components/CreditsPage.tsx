
import React from 'react';
import { Zap, Coins, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface CreditsPageProps {
  onTopUp: (amount: number) => void;
  onBuySLTokens: (amount: number) => void;
}

const CreditsPage: React.FC<CreditsPageProps> = ({ onTopUp, onBuySLTokens }) => {
  const creditPackages = [
    { credits: 10, price: '0.1 SOL', popular: false },
    { credits: 50, price: '0.4 SOL', popular: true },
    { credits: 100, price: '0.7 SOL', popular: false },
    { credits: 250, price: '1.5 SOL', popular: false }
  ];

  const slTokenPackages = [
    { tokens: 1000, price: '1 SOL', popular: false },
    { tokens: 5000, price: '4 SOL', popular: true },
    { tokens: 10000, price: '7 SOL', popular: false },
    { tokens: 25000, price: '15 SOL', popular: false }
  ];

  return (
    <div className="p-4 space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Get More Credits</h1>
        <p className="text-gray-600">Purchase credits with SOL to keep swiping and discovering tokens</p>
      </div>

      {/* Credit Packages */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-yellow-600" />
          <h2 className="text-lg font-semibold text-gray-900">Credit Packages</h2>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          💡 Liking tokens is free! Credits are only used when you pass on tokens.
        </p>
        
        <div className="grid grid-cols-2 gap-3">
          {creditPackages.map((pkg, index) => (
            <Card key={index} className={`p-4 relative ${pkg.popular ? 'border-2 border-yellow-500' : ''}`}>
              {pkg.popular && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    POPULAR
                  </span>
                </div>
              )}
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Zap className="w-4 h-4 text-yellow-600" />
                  <span className="text-xl font-bold">{pkg.credits}</span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{pkg.price}</p>
                <Button 
                  onClick={() => onTopUp(pkg.credits)}
                  className={`w-full ${pkg.popular ? 'bg-yellow-500 hover:bg-yellow-600' : ''}`}
                  size="sm"
                >
                  <CreditCard className="w-4 h-4 mr-1" />
                  Buy with SOL
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* SL Token Packages */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Coins className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">SL Token Packages</h2>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          SL token holders get daily free credits (1 credit per 100 SL tokens, max 50/day)
        </p>
        
        <div className="grid grid-cols-2 gap-3">
          {slTokenPackages.map((pkg, index) => (
            <Card key={index} className={`p-4 relative ${pkg.popular ? 'border-2 border-blue-500' : ''}`}>
              {pkg.popular && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    POPULAR
                  </span>
                </div>
              )}
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Coins className="w-4 h-4 text-blue-600" />
                  <span className="text-xl font-bold">{pkg.tokens.toLocaleString()}</span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{pkg.price}</p>
                <Button 
                  onClick={() => onBuySLTokens(pkg.tokens)}
                  className={`w-full ${pkg.popular ? 'bg-blue-500 hover:bg-blue-600' : ''}`}
                  size="sm"
                >
                  <CreditCard className="w-4 h-4 mr-1" />
                  Buy with SOL
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 text-center">
        <p className="text-sm text-gray-600">
          💡 Pro tip: SL token holders get automatic daily credit refills!
        </p>
      </div>
    </div>
  );
};

export default CreditsPage;
