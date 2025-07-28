'use client';

import React, { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Alert,
  AlertDescription,
  Progress,
  Badge,
} from '@/app/components/ui/basic';
import { 
  Volume2, 
  CheckCircle, 
  AlertCircle, 
  Play, 
  Pause, 
  Download,
  Loader2,
  Settings,
  VolumeX
} from 'lucide-react';
import { StepData } from './index';
import { useApiKeys } from '@/app/hooks/useApiKeys';

interface StepThreeAudioGenerationProps {
  stepData: StepData;
  updateStepData: (updates: Partial<StepData>) => void;
  onComplete: (data: Partial<StepData>) => void;
}

export default function StepThreeAudioGeneration({
  stepData,
  updateStepData,
  onComplete,
}: StepThreeAudioGenerationProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentGeneratingItem, setCurrentGeneratingItem] = useState('');
  const [audioPreview, setAudioPreview] = useState<{ [key: string]: { isPlaying: boolean; audio: HTMLAudioElement | null } }>({});
  const { hasValidApiKey } = useApiKeys();

  const handleVoiceChange = (key: string, voice: string) => {
    updateStepData({
      voicePreferences: {
        ...stepData.voicePreferences,
        [key]: voice
      }
    });
  };

  const getAudioItemsForPart = () => {
    const part = stepData.part;
    const items = [];
    
    switch (part) {
      case '1':
        // Conversations
        if (stepData.conversations) {
          stepData.conversations.forEach((conv, index) => {
            items.push({
              id: `conversation-${index}`,
              label: `Conversation ${index + 1}`,
              text: conv.audioText || conv.text,
              voiceKey: index === 0 ? 'speaker1' : 'speaker2',
              type: 'conversation'
            });
          });
        }
        break;
        
      case '2':
        // Monologue
        if (stepData.monologue) {
          items.push({
            id: 'monologue',
            label: 'Monologue',
            text: stepData.monologue.audioText || stepData.monologue.text,
            voiceKey: 'monologue',
            type: 'monologue'
          });
        }
        break;
        
      case '3':
        // Discussion speakers
        if (stepData.discussion) {
          stepData.discussion.forEach((speaker, index) => {
            items.push({
              id: `speaker-${index}`,
              label: `Speaker ${index + 1}`,
              text: speaker.text,
              voiceKey: speaker.gender === 'male' ? 'men' : 'woman',
              type: 'discussion'
            });
          });
        }
        break;
        
      case '4':
        // Lectures
        if (stepData.lectures) {
          stepData.lectures.forEach((lecture, index) => {
            items.push({
              id: `lecture-${index}`,
              label: `Lecture ${index + 1}`,
              text: lecture.audioText || lecture.text,
              voiceKey: `lecture${index + 1}`,
              type: 'lecture'
            });
          });
        }
        break;
    }
    
    return items;
  };

  const audioItems = getAudioItemsForPart();

  const handleGenerateAudio = async () => {
    // Check if ElevenLabs API key is configured
    if (!hasValidApiKey('elevenlabs')) {
      updateStepData({
        audioErrors: ['ElevenLabs API key is required for audio generation']
      });
      return;
    }
    
    setIsGenerating(true);
    setGenerationProgress(0);
    
    try {
      const audioFiles = [];
      const audioErrors = [];
      
      for (let i = 0; i < audioItems.length; i++) {
        const item = audioItems[i];
        setCurrentGeneratingItem(item.label);
        setGenerationProgress(((i + 1) / audioItems.length) * 100);
        
        try {
          // Simulate audio generation API call
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Mock audio URL - in real implementation, this would be the actual audio file URL
          const audioUrl = `https://example.com/audio/${item.id}.mp3`;
          audioFiles.push(audioUrl);
          
        } catch (error) {
          audioErrors.push(`Failed to generate audio for ${item.label}: ${error}`);
        }
      }
      
      const updatedData: Partial<StepData> = {
        audioFiles,
        audioErrors,
        audioGenerated: true,
      };
      
      updateStepData(updatedData);
      onComplete(updatedData);
      
    } catch (error) {
      console.error('Audio generation failed:', error);
      updateStepData({
        audioErrors: ['Audio generation failed. Please try again.']
      });
    } finally {
      setIsGenerating(false);
      setCurrentGeneratingItem('');
      setGenerationProgress(0);
    }
  };

  const handlePlayAudio = (audioUrl: string, itemId: string) => {
    const currentAudio = audioPreview[itemId]?.audio;
    
    if (currentAudio) {
      if (audioPreview[itemId]?.isPlaying) {
        currentAudio.pause();
        setAudioPreview(prev => ({
          ...prev,
          [itemId]: { ...prev[itemId], isPlaying: false }
        }));
      } else {
        currentAudio.play();
        setAudioPreview(prev => ({
          ...prev,
          [itemId]: { ...prev[itemId], isPlaying: true }
        }));
      }
    } else {
      const audio = new Audio(audioUrl);
      audio.onended = () => {
        setAudioPreview(prev => ({
          ...prev,
          [itemId]: { ...prev[itemId], isPlaying: false }
        }));
      };
      audio.play();
      setAudioPreview(prev => ({
        ...prev,
        [itemId]: { audio, isPlaying: true }
      }));
    }
  };

  const renderVoiceSettings = () => {
    const part = stepData.part;
    
    switch (part) {
      case '1':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Speaker 1 Voice</Label>
              <Select
                value={stepData.voicePreferences.speaker1 || ''}
                onValueChange={(value) => handleVoiceChange('speaker1', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Auto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Auto</SelectItem>
                  <SelectItem value="Aria">Aria (Female)</SelectItem>
                  <SelectItem value="Sarah">Sarah (Female)</SelectItem>
                  <SelectItem value="Drew">Drew (Male)</SelectItem>
                  <SelectItem value="Paul">Paul (Male)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium">Speaker 2 Voice</Label>
              <Select
                value={stepData.voicePreferences.speaker2 || ''}
                onValueChange={(value) => handleVoiceChange('speaker2', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Auto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Auto</SelectItem>
                  <SelectItem value="Aria">Aria (Female)</SelectItem>
                  <SelectItem value="Sarah">Sarah (Female)</SelectItem>
                  <SelectItem value="Drew">Drew (Male)</SelectItem>
                  <SelectItem value="Paul">Paul (Male)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
        
      case '2':
        return (
          <div>
            <Label className="text-sm font-medium">Monologue Voice</Label>
            <Select
              value={stepData.voicePreferences.monologue || ''}
              onValueChange={(value) => handleVoiceChange('monologue', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Auto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Auto</SelectItem>
                <SelectItem value="Aria">Aria (Female)</SelectItem>
                <SelectItem value="Sarah">Sarah (Female)</SelectItem>
                <SelectItem value="Drew">Drew (Male)</SelectItem>
                <SelectItem value="Paul">Paul (Male)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
        
      case '3':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Male Speakers</Label>
              <Select
                value={stepData.voicePreferences.men || ''}
                onValueChange={(value) => handleVoiceChange('men', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Auto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Auto</SelectItem>
                  <SelectItem value="Drew">Drew (Male)</SelectItem>
                  <SelectItem value="Paul">Paul (Male)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium">Female Speakers</Label>
              <Select
                value={stepData.voicePreferences.woman || ''}
                onValueChange={(value) => handleVoiceChange('woman', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Auto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Auto</SelectItem>
                  <SelectItem value="Aria">Aria (Female)</SelectItem>
                  <SelectItem value="Sarah">Sarah (Female)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
        
      case '4':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Lecture 1 Voice</Label>
              <Select
                value={stepData.voicePreferences.lecture1 || ''}
                onValueChange={(value) => handleVoiceChange('lecture1', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Auto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Auto</SelectItem>
                  <SelectItem value="Aria">Aria (Female)</SelectItem>
                  <SelectItem value="Sarah">Sarah (Female)</SelectItem>
                  <SelectItem value="Drew">Drew (Male)</SelectItem>
                  <SelectItem value="Paul">Paul (Male)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium">Lecture 2 Voice</Label>
              <Select
                value={stepData.voicePreferences.lecture2 || ''}
                onValueChange={(value) => handleVoiceChange('lecture2', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Auto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Auto</SelectItem>
                  <SelectItem value="Aria">Aria (Female)</SelectItem>
                  <SelectItem value="Sarah">Sarah (Female)</SelectItem>
                  <SelectItem value="Drew">Drew (Male)</SelectItem>
                  <SelectItem value="Paul">Paul (Male)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  if (!stepData.textReviewed) {
    return (
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <div className="p-4 bg-amber-50 rounded-lg">
            <AlertCircle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
            <h3 className="font-medium text-amber-800">Text Review Required</h3>
            <p className="text-sm text-amber-700">
              Please complete Step 2 (Review & Edit) before proceeding to audio generation.
            </p>
          </div>
        </div>
      </CardContent>
    );
  }

  return (
    <CardContent className="p-6">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Volume2 className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Step 3: Generate Audio</h3>
            <p className="text-sm text-gray-600">
              Create audio files for the listening content
            </p>
          </div>
        </div>

        {/* Audio Generation Progress */}
        {isGenerating && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-800">
                    Generating Audio...
                  </span>
                  <span className="text-sm text-blue-600">
                    {Math.round(generationProgress)}%
                  </span>
                </div>
                <Progress value={generationProgress} className="w-full" />
                {currentGeneratingItem && (
                  <p className="text-sm text-blue-700">
                    Currently generating: {currentGeneratingItem}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Voice Settings */}
        {!stepData.audioGenerated && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Voice Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderVoiceSettings()}
            </CardContent>
          </Card>
        )}

        {/* Audio Items to Generate */}
        <Card>
          <CardHeader>
            <CardTitle>Audio Items ({audioItems.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {audioItems.map((item, index) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{item.label}</Badge>
                      <span className="text-sm text-gray-600">
                        Voice: {stepData.voicePreferences[item.voiceKey] || 'Auto'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                      {item.text}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {stepData.audioFiles && stepData.audioFiles[index] ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePlayAudio(stepData.audioFiles[index], item.id)}
                          className="flex items-center space-x-1"
                        >
                          {audioPreview[item.id]?.isPlaying ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(stepData.audioFiles[index], '_blank')}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <div className="text-sm text-gray-500">
                        {isGenerating ? 'Generating...' : 'Not generated'}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Generate Audio Button */}
        {!stepData.audioGenerated && (
          <div className="space-y-4">
            {!hasValidApiKey('elevenlabs') && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  ElevenLabs API key is required for audio generation. Please configure your API key in Step 1.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="flex justify-center">
              <Button
                onClick={handleGenerateAudio}
                disabled={isGenerating || !hasValidApiKey('elevenlabs')}
                className="bg-purple-600 hover:bg-purple-700 px-8 py-3"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Audio...
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 mr-2" />
                    Generate Audio Files
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Audio Generation Errors */}
        {stepData.audioErrors && stepData.audioErrors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <p className="font-medium">Audio generation errors:</p>
                {stepData.audioErrors.map((error, index) => (
                  <p key={index} className="text-sm">• {error}</p>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Success Message */}
        {stepData.audioGenerated && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Audio generation completed successfully! Generated {stepData.audioFiles.length} audio files.
              You can now proceed to Step 4: Final Preview.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </CardContent>
  );
}