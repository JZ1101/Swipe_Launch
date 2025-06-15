import React, { useState, useRef } from 'react';
import { Heart, X, TrendingUp, Users, Clock, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SwipeCardProps {
  token: any;
  onSwipe: (direction: 'left' | 'right', tokenId: number) => void;
  canSwipe: boolean;
}

const SwipeCard: React.FC<SwipeCardProps> = ({ token, onSwipe, canSwipe }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleStart = (clientX: number, clientY: number) => {
    if (!canSwipe) return;
    setIsDragging(true);
    setStartPos({ x: clientX, y: clientY });
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging || !canSwipe) return;
    
    const deltaX = clientX - startPos.x;
    const deltaY = clientY - startPos.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleEnd = () => {
    if (!isDragging || !canSwipe) return;
    
    const threshold = 100;
    const { x } = dragOffset;
    
    if (Math.abs(x) > threshold) {
      const direction = x > 0 ? 'right' : 'left';
      onSwipe(direction, token.id);
    }
    
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  const handleButtonSwipe = (direction: 'left' | 'right') => {
    if (canSwipe) {
      onSwipe(direction, token.id);
    }
  };

  const rotation = dragOffset.x * 0.1;
  const opacity = Math.max(0.7, 1 - Math.abs(dragOffset.x) * 0.002);

  // Calculate swipe feedback
  const swipeDirection = Math.abs(dragOffset.x) > 50 ? (dragOffset.x > 0 ? 'right' : 'left') : null;
  const swipeIntensity = Math.min(Math.abs(dragOffset.x) / 100, 1);

  const cardStyle = {
    transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg)`,
    opacity,
    transition: isDragging ? 'none' : 'transform 0.2s ease-out, opacity 0.2s ease-out'
  };

  const isFresh = token.likes < 80;

  return (
    <div className="w-full max-w-sm mx-auto relative">
      {/* Swipe feedback overlays */}
      {swipeDirection === 'left' && (
        <div 
          className="absolute inset-0 bg-red-500/20 rounded-2xl z-10 flex items-center justify-center transition-opacity"
          style={{ opacity: swipeIntensity }}
        >
          <div className="bg-red-500 rounded-full p-4">
            <X className="w-8 h-8 text-white" />
          </div>
        </div>
      )}
      
      {swipeDirection === 'right' && (
        <div 
          className="absolute inset-0 bg-pink-500/20 rounded-2xl z-10 flex items-center justify-center transition-opacity"
          style={{ opacity: swipeIntensity }}
        >
          <div className="bg-pink-500 rounded-full p-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
        </div>
      )}

      <Card
        ref={cardRef}
        className={`relative bg-white shadow-xl rounded-2xl overflow-hidden ${canSwipe ? 'cursor-grab active:cursor-grabbing' : 'cursor-not-allowed opacity-75'}`}
        style={cardStyle}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative">
          <img
            src={token.image}
            alt={token.name}
            className="w-full h-64 object-cover"
          />
          
          <div className="absolute top-4 left-4 flex gap-2">
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
              isFresh
                ? 'bg-cyan-100 text-cyan-700 border border-cyan-200'
                : token.status === 'presale' 
                ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                : 'bg-green-100 text-green-700 border border-green-200'
            }`}>
              {isFresh ? 'FRESH' : token.status === 'presale' ? 'PRESALE' : 'LAUNCHED'}
            </div>
          </div>

          {/* Only show price for launched tokens */}
          {token.status === 'launched' && !isFresh && (
            <div className="absolute top-4 right-4">
              <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className="text-sm font-bold text-gray-900">{token.price}</span>
              </div>
            </div>
          )}

          {/* Show presale info for presale tokens */}
          {token.status === 'presale' && !isFresh && (
            <div className="absolute top-4 right-4">
              <div className="bg-amber-100/90 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className="text-sm font-bold text-amber-700">0.01 SOL</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{token.name}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{token.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-sm font-semibold">{token.likes} likes</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-semibold">{token.marketCap}</span>
            </div>
            {token.status === 'presale' && token.progress && (
              <div className="flex items-center gap-2 col-span-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm font-semibold">Progress: {token.progress || 0}%</span>
              </div>
            )}
            {isFresh && (
              <div className="flex items-center gap-2 col-span-2">
                <Zap className="w-4 h-4 text-cyan-500" />
                <span className="text-sm font-semibold text-cyan-600">Needs 80+ likes for presale</span>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4 sticky bottom-0 bg-white">
            <Button
              onClick={() => handleButtonSwipe('left')}
              variant="ghost"
              size="lg"
              className="flex-1 bg-transparent border-2 border-red-200 text-red-600 hover:bg-red-50/50 backdrop-blur-sm"
              disabled={!canSwipe}
            >
              <X className="w-5 h-5 mr-2" />
              Pass
            </Button>
            <Button
              onClick={() => handleButtonSwipe('right')}
              size="lg"
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              disabled={!canSwipe}
            >
              <Heart className="w-5 h-5 mr-2" />
              Like
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SwipeCard;
