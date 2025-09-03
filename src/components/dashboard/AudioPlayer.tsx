
import React, { useRef, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Pause, RotateCcw, Volume2 } from "lucide-react";

interface AudioPlayerProps {
  audioUrl: string;
  transcript: string;
  onTimeUpdate?: (currentTime: number) => void;
}

const AudioPlayer = ({ audioUrl, transcript, onTimeUpdate }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  // Split transcript into words for highlighting
  const words = transcript.split(' ');
  const wordsPerSecond = words.length / (duration || 1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      onTimeUpdate?.(audio.currentTime);
    };

    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onTimeUpdate]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = value[0];
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    const newVolume = value[0];
    
    if (audio) {
      audio.volume = newVolume;
    }
    setVolume(newVolume);
  };

  const resetAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    setCurrentTime(0);
    setIsPlaying(false);
    audio.pause();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate which words should be highlighted based on current time
  const getCurrentWordIndex = () => {
    return Math.floor(currentTime * wordsPerSecond);
  };

  const renderLiveTranscript = () => {
    const currentWordIndex = getCurrentWordIndex();
    const highlightRange = 5; // Highlight current word and next few words

    return words.map((word, index) => {
      const isHighlighted = index >= currentWordIndex && index < currentWordIndex + highlightRange;
      const isCurrent = index === currentWordIndex;
      
      return (
        <span
          key={index}
          className={`${
            isCurrent 
              ? 'bg-primary text-primary-foreground px-1 rounded' 
              : isHighlighted 
                ? 'bg-accent text-accent-foreground px-1 rounded' 
                : 'text-muted-foreground'
          } transition-colors duration-300`}
        >
          {word}{' '}
        </span>
      );
    });
  };

  return (
    <div className="space-y-6">
      {/* Audio Controls */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center text-card-foreground">
            <Volume2 className="h-5 w-5 mr-2" />
            Audio Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <audio ref={audioRef} src={audioUrl} preload="metadata" />
          
          {/* Main Controls */}
          <div className="flex items-center space-x-4">
            <Button
              onClick={togglePlayPause}
              size="sm"
              className="bg-primary hover:bg-primary-hover text-primary-foreground"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            
            <Button onClick={resetAudio} size="sm" variant="outline" className="border-border text-foreground hover:bg-accent hover:text-accent-foreground">
              <RotateCcw className="h-4 w-4" />
            </Button>

            <div className="flex items-center space-x-2 flex-1">
              <span className="text-sm text-muted-foreground min-w-[45px]">
                {formatTime(currentTime)}
              </span>
              <Slider
                value={[currentTime]}
                onValueChange={handleSeek}
                max={duration || 100}
                step={1}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground min-w-[45px]">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-2">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <Slider
              value={[volume]}
              onValueChange={handleVolumeChange}
              max={1}
              step={0.1}
              className="w-24"
            />
          </div>
        </CardContent>
      </Card>

      {/* Live Transcript */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Live Transcript</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea ref={scrollAreaRef} className="h-64 w-full border border-border rounded-md p-4 bg-background">
            <div className="text-sm leading-relaxed">
              {renderLiveTranscript()}
            </div>
          </ScrollArea>
          <div className="mt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded"></div>
                <span>Current word</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-accent rounded"></div>
                <span>Upcoming words</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AudioPlayer;
