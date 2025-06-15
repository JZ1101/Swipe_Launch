
import React from 'react';
import { Heart, Trophy, Bell, User, Star } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'discover', icon: Heart, label: 'Discover' },
    { id: 'superstar', icon: Star, label: 'SuperStar' },
    { id: 'leaderboard', icon: Trophy, label: 'Rankings' },
    { id: 'notifications', icon: Bell, label: 'Activity' },
    { id: 'upload', icon: User, label: 'Profile' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-50">
      <div className="flex justify-around max-w-md mx-auto">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center py-2 px-2 rounded-lg transition-all ${
              activeTab === id 
                ? 'text-pink-600 bg-pink-50' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
