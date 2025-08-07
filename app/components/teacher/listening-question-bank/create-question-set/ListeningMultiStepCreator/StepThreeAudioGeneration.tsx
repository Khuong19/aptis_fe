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
import { getListeningAudioUrl, getListeningFolderName } from '@/app/lib/utils/audioUtils';
import { fetchWithAuth } from '@/app/lib/auth/apiInterceptor';

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
    const part = String(stepData.part);
    const items = [];
    
    switch (part) {
      case '1':
        // Conversations - each conversation has segments
        if (stepData.conversations) {
          stepData.conversations.forEach((conv, convIndex) => {
            if (conv.segments && Array.isArray(conv.segments)) {
              conv.segments.forEach((segment: any, segIndex: number) => {
                items.push({
                  id: `segment-${convIndex}-${segIndex}`,
                  label: `${conv.title || `Conversation ${convIndex + 1}`} - ${segment.speaker || `Speaker ${segIndex + 1}`}`,
                  text: segment.text,
                  voiceKey: segIndex % 2 === 0 ? 'speaker1' : 'speaker2',
                  type: 'conversation-segment'
                });
              });
            } else {
              // Fallback for conversations without segments
              items.push({
                id: `conversation-${convIndex}`,
                label: `Conversation ${convIndex + 1}`,
                text: conv.audioText || conv.text || '',
                voiceKey: convIndex % 2 === 0 ? 'speaker1' : 'speaker2',
                type: 'conversation'
              });
            }
          });
        }
        break;
        
      case '2':
        // Monologue - Generate audio for each segment
        if (stepData.monologue && stepData.monologue.segments) {
          stepData.monologue.segments.forEach((segment: any, index: number) => {
            items.push({
              id: `segment-${index}`,
              label: `${segment.speaker || `Person ${index + 1}`}`,
              text: segment.text,
              voiceKey: 'monologue',
              type: 'monologue-segment'
            });
          });
        } else if (stepData.monologue) {
          // Fallback to original monologue text
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
          stepData.discussion.forEach((speaker: any, index: number) => {
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
          stepData.lectures.forEach((lecture: any, index: number) => {
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
      
      // Generate unique folder name for this question set
      const timestamp = Date.now();
      const folderName = getListeningFolderName(stepData.part, timestamp);
      
      for (let i = 0; i < audioItems.length; i++) {
        const item = audioItems[i];
        setCurrentGeneratingItem(item.label);
        setGenerationProgress(((i + 1) / audioItems.length) * 100);
        
        try {
          // Call API to generate actual audio file
          const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/ai/generate-single-audio`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              text: item.text,
              voice: stepData.voicePreferences[item.voiceKey] || 'auto',
              fileName: `${item.id}.mp3`,
              folderName: folderName,
              part: stepData.part,
            }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          
          if (result.success) {
            // Generate audio URL based on upload/listening folder structure
            const audioUrl = getListeningAudioUrl(folderName, `${item.id}.mp3`);
            audioFiles.push(audioUrl);
            console.log(`Generated audio for ${item.label}:`, audioUrl);
          } else {
            throw new Error(result.error || 'Audio generation failed');
          }
          
        } catch (error) {
          console.error(`Failed to generate audio for ${item.label}:`, error);
          audioErrors.push(`Failed to generate audio for ${item.label}: ${error}`);
        }
      }
      
      const updatedData: Partial<StepData> = {
        audioFiles,
        audioErrors,
        audioGenerated: true,
        audioFolder: folderName, // Store folder name for reference
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
    const part = String(stepData.part);
    
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
          <div className="space-y-4">
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
            
            {stepData.monologue?.segments && stepData.monologue.segments.length > 0 && (
              <div className="p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-700">
                  <strong>Note:</strong> Audio will be generated for each segment ({stepData.monologue.segments.length} segments total)
                </p>
              </div>
            )}
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

     // Always show Step 3 content (removed textReviewed check)

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