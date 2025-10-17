
import React from 'react';
import { Platform } from '../types';

interface PlatformSelectorProps {
  selectedPlatform: Platform;
  onPlatformChange: (platform: Platform) => void;
  isLoading: boolean;
}

const PlatformSelector: React.FC<PlatformSelectorProps> = ({ selectedPlatform, onPlatformChange, isLoading }) => {
  const getButtonClasses = (platform: Platform) => {
    const baseClasses = 'w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-secondary focus:ring-brand-accent';
    if (selectedPlatform === platform) {
      return `${baseClasses} bg-brand-accent text-brand-primary shadow-lg`;
    }
    return `${baseClasses} bg-brand-secondary text-brand-light hover:bg-indigo-500`;
  };

  return (
    <div className="flex gap-4 p-1 bg-brand-secondary/50 rounded-xl max-w-sm mx-auto">
      <button 
        onClick={() => onPlatformChange(Platform.YouTube)} 
        className={getButtonClasses(Platform.YouTube)}
        disabled={isLoading}
      >
        YouTube
      </button>
      <button 
        onClick={() => onPlatformChange(Platform.Instagram)} 
        className={getButtonClasses(Platform.Instagram)}
        disabled={isLoading}
      >
        Instagram
      </button>
    </div>
  );
};

export default PlatformSelector;
