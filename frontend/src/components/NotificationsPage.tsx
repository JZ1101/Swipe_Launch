
import React from 'react';
import { notifications } from '../data/tokens';
import { Card } from '@/components/ui/card';
import { Heart, ExternalLink, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { tokens } from '../data/tokens';

interface NotificationsPageProps {
  onNotificationClick: (tokenId: number) => void;
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({ onNotificationClick }) => {
  const { toast } = useToast();

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - timestamp.getTime();
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

    if (diffInMins < 60) {
      return `${diffInMins}m ago`;
    } else {
      return `${diffInHours}h ago`;
    }
  };

  const getTokenInfo = (tokenId: number) => {
    const token = tokens.find(t => t.id === tokenId);
    return token ? { name: token.name, image: token.image } : { name: 'Unknown Token', image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=100&h=100&fit=crop' };
  };

  const handleNotificationClick = (tokenId: number) => {
    const tokenInfo = getTokenInfo(tokenId);
    console.log(`Notification clicked - Token ID: ${tokenId}, Token: ${tokenInfo.name}`);
    toast({
      title: "Navigating to Token",
      description: `Opening ${tokenInfo.name} details...`,
    });
    onNotificationClick(tokenId);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Activity Feed</h1>
        <p className="text-gray-600">Celebrity endorsements and interactions</p>
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => {
          const tokenInfo = getTokenInfo(notification.tokenId);
          return (
            <Card 
              key={notification.id} 
              className="p-4 bg-white border-0 shadow-md cursor-pointer hover:shadow-lg hover:bg-gray-50 transition-all duration-200 active:scale-98"
              onClick={() => handleNotificationClick(notification.tokenId)}
            >
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <img
                    src={notification.avatar}
                    alt={notification.celebrity}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-gray-900 leading-relaxed">
                        <span className="font-bold text-purple-600">{notification.celebrity}</span>
                        <span className="mx-1">{notification.action}</span>
                        <span 
                          className="font-semibold text-pink-600 underline cursor-pointer hover:text-pink-800"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNotificationClick(notification.tokenId);
                          }}
                        >
                          {tokenInfo.name} (#{notification.tokenId})
                        </span>
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <p className="text-sm text-gray-500">
                          {formatTimeAgo(notification.timestamp)}
                        </p>
                        <span className="text-xs bg-blue-100 px-2 py-1 rounded-full text-blue-600 font-medium">
                          Token ID: {notification.tokenId}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4 text-red-500 fill-current" />
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {notifications.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications yet</h3>
          <p className="text-gray-600">Celebrity interactions will appear here</p>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
