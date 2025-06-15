
import { mergeTokenData } from '../utils/tokenUtils';

export const tokens = mergeTokenData();

export const notifications = [
  {
    id: 1,
    celebrity: 'Elon Musk',
    action: 'liked',
    tokenName: 'DOGE',
    tokenId: 1,
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: 2,
    celebrity: 'Vitalik Buterin',
    action: 'liked',
    tokenName: 'SHIB',
    tokenId: 2,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: 3,
    celebrity: 'Mark Cuban',
    action: 'liked',
    tokenName: 'FARTCOIN',
    tokenId: 6,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
  }
];
