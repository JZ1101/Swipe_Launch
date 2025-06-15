
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface FloatingUploadButtonProps {
  onClick: () => void;
}

const FloatingUploadButton: React.FC<FloatingUploadButtonProps> = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-16 right-6 w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 z-50 hover:scale-110"
    >
      <Plus className="w-5 h-5 text-white" />
    </Button>
  );
};

export default FloatingUploadButton;
