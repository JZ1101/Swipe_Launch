import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import DiscoverPage from '../components/DiscoverPage';
import LeaderboardPage from '../components/LeaderboardPage';
import NotificationsPage from '../components/NotificationsPage';
import UploadPage from '../components/UploadPage';
import ProfilePage from '../components/ProfilePage';
import SuperStarPage from '../components/SuperStarPage';
import CreditsPage from '../components/CreditsPage';
import LikedPage from '../components/LikedPage';
import PortfolioPage from '../components/PortfolioPage';
import FloatingUploadButton from '../components/FloatingUploadButton';
import { tokens } from '../data/tokens';
import { initializeLikes, addLike } from '../utils/likeManager';
import '../components/card-animations.css';

const Index = () => {
  const [activeTab, setActiveTab] = useState('discover');
  const [credits, setCredits] = useState(10);
  const [slTokenBalance, setSlTokenBalance] = useState(1250);
  const [likedTokens, setLikedTokens] = useState<number[]>([]);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Initialize the like system
  useEffect(() => {
    initializeLikes(tokens);
  }, []);

  // Load liked tokens from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('likedTokens');
    if (saved) {
      setLikedTokens(JSON.parse(saved));
    }
  }, []);

  // Save liked tokens to localStorage
  useEffect(() => {
    localStorage.setItem('likedTokens', JSON.stringify(likedTokens));
  }, [likedTokens]);

  // Check for daily refresh
  useEffect(() => {
    const checkDailyRefresh = () => {
      const now = new Date();
      const hoursSinceLastRefresh = (now.getTime() - lastRefresh.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceLastRefresh >= 24 && slTokenBalance > 0) {
        const newCredits = Math.min(slTokenBalance / 100, 50);
        setCredits(Math.floor(newCredits));
        setLastRefresh(now);
      }
    };

    checkDailyRefresh();
    const interval = setInterval(checkDailyRefresh, 60000);
    return () => clearInterval(interval);
  }, [lastRefresh, slTokenBalance]);

  const handleSwipe = (direction: 'left' | 'right', tokenId: number) => {
    if (direction === 'right') {
      setLikedTokens(prev => [...prev, tokenId]);
      const newLikeCount = addLike(tokenId);
      console.log(`Liked token: ${tokens.find(t => t.id === tokenId)?.name} - Total likes: ${newLikeCount}`);
    } else {
      console.log(`Passed on token: ${tokens.find(t => t.id === tokenId)?.name}`);
    }
  };

  const handleCreditsUsed = () => {
    setCredits(prev => Math.max(0, prev - 1));
  };

  const handleNotificationClick = (tokenId: number) => {
    setActiveTab('discover');
    console.log(`Navigating to token: ${tokenId}`);
  };

  const handleTopUp = (amount: number) => {
    setCredits(prev => prev + amount);
  };

  const handleBuySLTokens = (amount: number) => {
    setSlTokenBalance(prev => prev + amount);
  };

  const handleCreateClick = () => {
    setShowUploadModal(true);
  };

  const handleUploadComplete = () => {
    setShowUploadModal(false);
    setActiveTab('upload'); // Go back to profile after upload
  };

  const showFloatingButton = !['upload'].includes(activeTab) && !showUploadModal;

  const renderActiveTab = () => {
    if (showUploadModal) {
      return <UploadPage onComplete={handleUploadComplete} />;
    }

    switch (activeTab) {
      case 'discover':
        return (
          <DiscoverPage 
            credits={credits}
            onSwipe={handleSwipe}
            onCreditsUsed={handleCreditsUsed}
          />
        );
      case 'superstar':
        return (
          <SuperStarPage 
            credits={credits}
            onSwipe={handleSwipe}
            onCreditsUsed={handleCreditsUsed}
          />
        );
      case 'leaderboard':
        return <LeaderboardPage />;
      case 'notifications':
        return <NotificationsPage onNotificationClick={handleNotificationClick} />;
      case 'upload':
        return <ProfilePage onCreateClick={handleCreateClick} />;
      case 'portfolio':
        return <PortfolioPage onUploadClick={handleCreateClick} />;
      case 'credits':
        return <CreditsPage onTopUp={handleTopUp} onBuySLTokens={handleBuySLTokens} />;
      case 'liked':
        return <LikedPage likedTokens={likedTokens} />;
      default:
        return <DiscoverPage credits={credits} onSwipe={handleSwipe} onCreditsUsed={handleCreditsUsed} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto relative">
      <Header 
        credits={credits} 
        slTokenBalance={slTokenBalance} 
        onCreditsClick={() => setActiveTab('credits')}
        onLikedClick={() => setActiveTab('liked')}
        onPortfolioClick={() => setActiveTab('portfolio')}
      />
      
      <main className="flex-1 overflow-y-auto pb-20">
        {renderActiveTab()}
      </main>

      {showFloatingButton && (
        <FloatingUploadButton onClick={handleCreateClick} />
      )}

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
