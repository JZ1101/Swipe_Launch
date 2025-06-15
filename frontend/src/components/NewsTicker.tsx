
import React, { useState, useEffect } from 'react';
import { newsData } from '../data/newsData';

const NewsTicker: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % newsData.length);
    }, 4000); // Change news every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const currentNews = newsData[currentIndex];

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-3 mb-4 mx-4">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold text-blue-700">LIVE</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-sm text-gray-800 animate-pulse truncate">
            {currentNews.title}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;
