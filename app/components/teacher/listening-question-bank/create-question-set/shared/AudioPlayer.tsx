'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/app/components/ui/basic';
import { Play, Pause, Volume2 } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string;
  label?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showLabel?: boolean;
  className?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  audioUrl, 
  label = 'Play Audio',
  size = 'default',
  showLabel = false,
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio(audioUrl);
    
    // Set up event listeners
    const audio = audioRef.current;
    
    const handlePlay = () => {
      setIsPlaying(true);
      setIsLoading(false);
      setError(null);
    };
    
    const handlePause = () => {
      setIsPlaying(false);
      setIsLoading(false);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setIsLoading(false);
    };
    
    const handleError = (e: Event) => {
      console.error('Audio playback error:', e);
      setError('Failed to load audio');
      setIsPlaying(false);
      setIsLoading(false);
    };
    
    const handleLoadStart = () => {
      setIsLoading(true);
      setError(null);
    };
    
    const handleCanPlay = () => {
      setIsLoading(false);
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [audioUrl]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((error) => {
        console.error('Failed to play audio:', error);
        setError('Failed to play audio');
      });
    }
  };

  const getButtonSize = () => {
    switch (size) {
      case 'sm':
        return 'h-8 w-8';
      case 'lg':
        return 'h-12 w-12';
      default:
        return 'h-8 w-8';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'h-4 w-4';
      case 'lg':
        return 'h-6 w-6';
      default:
        return 'h-4 w-4';
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant="outline"
        size={size}
        onClick={handlePlayPause}
        disabled={isLoading || !!error}
        className={`${getButtonSize()} p-0 disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isLoading ? (
          <div className={`${getIconSize()} animate-spin rounded-full border-2 border-gray-300 border-t-blue-600`} />
        ) : error ? (
          <Volume2 className={getIconSize()} />
        ) : isPlaying ? (
          <Pause className={getIconSize()} />
        ) : (
          <Play className={getIconSize()} />
        )}
      </Button>
      
      {showLabel && (
        <span className="text-sm text-gray-600">
          {isLoading ? 'Loading...' : error ? 'Error' : isPlaying ? 'Playing' : label}
        </span>
      )}
      
      {error && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </div>
  );
};

export default AudioPlayer; 