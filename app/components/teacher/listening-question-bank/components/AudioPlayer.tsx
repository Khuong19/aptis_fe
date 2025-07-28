'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/app/components/ui/basic';
import { Play, Pause, Volume2, Download } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string;
  title?: string;
  className?: string;
}

// Utility function to normalize audio URLs
const normalizeAudioUrl = (url: string): string => {
  if (!url) return '';
  
  // Convert backslashes to forward slashes
  let normalizedUrl = url.replace(/\\/g, '/');
  
  // If it's a raw uploads path, add /api/ prefix
  if (normalizedUrl.startsWith('uploads/')) {
    normalizedUrl = `/api/${normalizedUrl}`;
  }
  
  return normalizedUrl;
};

export default function AudioPlayer({ audioUrl, title, className = '' }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Normalize and validate audio URL
  const normalizedAudioUrl = normalizeAudioUrl(audioUrl);
  const isValidAudioUrl = normalizedAudioUrl && (
    normalizedAudioUrl.startsWith('http://') || 
    normalizedAudioUrl.startsWith('https://') || 
    normalizedAudioUrl.startsWith('/api/uploads/')
  );

  const handlePlayPause = () => {
    if (!isValidAudioUrl) {
      setError('Invalid audio URL');
      return;
    }
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((err) => {
          console.error('Audio playback error:', err);
          setError('Failed to play audio');
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setIsLoading(false);
      setError(null);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleError = () => {
    setIsLoading(false);
    setError('Failed to load audio file');
    console.error('Audio loading error for URL:', audioUrl);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = normalizedAudioUrl;
    link.download = title || 'audio.mp3';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Volume2 className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            {title || 'Audio Segment'}
          </span>
        </div>
        {isValidAudioUrl && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="h-8 px-2"
          >
            <Download className="w-3 h-3" />
          </Button>
        )}
      </div>

      {!isValidAudioUrl ? (
        <div className="text-red-600 text-sm p-2 bg-red-50 rounded">
          ❌ Invalid audio URL: {audioUrl} (normalized: {normalizedAudioUrl})
        </div>
      ) : error ? (
        <div className="text-red-600 text-sm p-2 bg-red-50 rounded">
          ❌ {error}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePlayPause}
              className="h-8 w-8"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-3 h-3" />
              ) : (
                <Play className="w-3 h-3" />
              )}
            </Button>
            
            <div className="flex-1">
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentTime / (duration || 1)) * 100}%, #e5e7eb ${(currentTime / (duration || 1)) * 100}%, #e5e7eb 100%)`
                }}
              />
            </div>
            
            <span className="text-xs text-gray-500 min-w-[40px]">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
        </div>
      )}

      {isValidAudioUrl && (
        <audio
          ref={audioRef}
          src={normalizedAudioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          onError={handleError}
          preload="metadata"
        />
      )}
    </div>
  );
}

interface AudioListProps {
  audioFiles: string[];
  className?: string;
}

export function AudioList({ audioFiles, className = '' }: AudioListProps) {
  console.log('🎵 AudioList received audioFiles:', audioFiles);
  
  if (audioFiles.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <h4 className="text-sm font-medium text-gray-700 mb-2">Generated Audio Files</h4>
      {audioFiles.map((audioUrl, index) => {
        console.log(`🎵 Audio ${index + 1} URL:`, audioUrl);
        return (
          <AudioPlayer
            key={index}
            audioUrl={audioUrl}
            title={`Audio Segment ${index + 1}`}
          />
        );
      })}
    </div>
  );
} 