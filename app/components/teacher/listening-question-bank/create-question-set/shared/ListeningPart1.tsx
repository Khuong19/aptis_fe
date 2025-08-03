'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/basic';
import { Edit2, Save, X, Play, Pause } from 'lucide-react';
import toast from 'react-hot-toast';

interface Segment {
  id: string;
  text: string;
  speaker: string;
  order: number;
}

interface Question {
  id: string;
  text: string;
  options: {
    [key: string]: string;
  };
  answer: string;
}

interface Conversation {
  id: string;
  title: string;
  context: string;
  difficulty: string;
  segments: Segment[];
  question: Question;
  audioUrl?: string;
  audioText?: string;
}

interface ListeningPart1Props {
  previewData: {
    title: string;
    description: string;
    type: string;
    part: number;
    level: string;
    conversations: Conversation[];
    audioFiles?: string[];
    passageText?: string;
    passage?: string;
  };
  onEdit: (data: any) => void;
}

const ListeningPart1: React.FC<ListeningPart1Props> = ({ previewData, onEdit }) => {
  const [editingConversationIndex, setEditingConversationIndex] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<Conversation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [editingPassage, setEditingPassage] = useState(false);
  const [passageText, setPassageText] = useState('');
  const [isQuestionAudioPlaying, setIsQuestionAudioPlaying] = useState(false);

  // Audio URL for the conversation
  const audioUrl = React.useMemo(() => {
    return (
      previewData?.conversations?.[0]?.audioUrl || 
      (Array.isArray(previewData?.audioFiles) ? previewData.audioFiles[0] : undefined)
    );
  }, [previewData?.conversations, previewData?.audioFiles]);
  
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const handlePlayPauseAudio = () => {
    if (!audioRef.current) return;
    if (isQuestionAudioPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
        toast.error('Failed to play audio');
      });
    }
  };

  React.useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;
    
    const onEnded = () => setIsQuestionAudioPlaying(false);
    const onPlay = () => setIsQuestionAudioPlaying(true);
    const onPause = () => setIsQuestionAudioPlaying(false);
    
    audioElement.addEventListener('ended', onEnded);
    audioElement.addEventListener('play', onPlay);
    audioElement.addEventListener('pause', onPause);
    
    return () => {
      audioElement.removeEventListener('ended', onEnded);
      audioElement.removeEventListener('play', onPlay);
      audioElement.removeEventListener('pause', onPause);
    };
  }, []);

  // Extract passage text - support both formats, prioritize passageText (database field)
  const currentPassage = React.useMemo(() => {
    return previewData?.passageText || previewData?.passage || '';
  }, [previewData?.passageText, previewData?.passage]);

  const handleStartEditing = (idx: number) => {
    setEditingConversationIndex(idx);
    setEditingData(JSON.parse(JSON.stringify(previewData.conversations[idx])));
  };

  const handleCancelEditing = React.useCallback(() => {
    setEditingConversationIndex(null);
    setEditingData(null);
    toast('Changes discarded', { icon: 'ℹ️' });
  }, []);

  const handleInputChange = (field: keyof Conversation, value: string) => {
    if (!editingData) return;
    setEditingData({ ...editingData, [field]: value });
  };

  const handleSegmentChange = (segmentId: string, field: keyof Segment, value: string) => {
    if (!editingData) return;
    const updatedSegments = editingData.segments.map(segment => 
      segment.id === segmentId ? { ...segment, [field]: value } : segment
    );
    setEditingData({ ...editingData, segments: updatedSegments });
  };

  const handleQuestionChange = (field: keyof Question, value: string) => {
    if (!editingData) return;
    setEditingData({
      ...editingData,
      question: { 
        ...editingData.question, 
        [field]: field === 'answer' ? value : value 
      }
    });
  };

  const handleOptionChange = (optionKey: string, value: string) => {
    if (!editingData) return;
    setEditingData({
      ...editingData,
      question: {
        ...editingData.question,
        options: {
          ...editingData.question.options,
          [optionKey]: value
        }
      }
    });
  };

  // Helper function to safely access question options
  const getQuestionOptions = (question: Question) => {
    return Object.entries(question?.options || {});
  };

  const handleSave = React.useCallback(() => {
    if (!onEdit || !editingData || editingConversationIndex === null) {
      toast.error('Cannot save: Invalid editing state');
      return;
    }
    
    try {
      const updatedConversations = [...previewData.conversations];
      updatedConversations[editingConversationIndex] = editingData;
      
      onEdit({
        ...previewData,
        conversations: updatedConversations
      });
      
      setEditingConversationIndex(null);
      setEditingData(null);
      toast.success('Conversation updated successfully!');
    } catch (error) {
      console.error('Error saving conversation:', error);
      toast.error('Failed to save conversation');
    }
  }, [editingData, editingConversationIndex, onEdit, previewData]);

  const handleCancelEditingPassage = () => {
    setEditingPassage(false);
  };

  const handleStartEditingPassage = () => {
    setPassageText(currentPassage);
    setEditingPassage(true);
  };

  const handleSavePassage = useCallback(() => {
    if (!onEdit) {
      toast.error('Cannot save: No edit handler provided');
      return;
    }
    
    try {
      onEdit({ 
        ...previewData, 
        passageText: passageText,
        description: previewData.description || '',
        type: previewData.type || 'listening',
        level: previewData.level || 'mixed'
      });
      setEditingPassage(false);
      toast.success('Passage updated successfully!');
    } catch (error) {
      console.error('Error saving passage:', error);
      toast.error('Failed to save passage');
    }
  }, [onEdit, passageText, previewData]);


  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    // Here you would integrate with audio playback functionality
    toast.success(isPlaying ? 'Audio paused' : 'Audio playing');
  };

  return (
    <div className="space-y-6">
      {/* Audio Text Section */}
      {previewData?.conversations && Array.isArray(previewData.conversations) && 
       previewData.conversations.some((conv: any) => conv.audioText) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Audio Text</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {previewData.conversations.map((conv: any, index: number) => 
                conv.audioText ? (
                  <div key={index} className="bg-gray-50 p-4 rounded-md">
                    <div className="text-sm font-medium text-gray-800 mb-2">
                      Conversation {index + 1}
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {conv.audioText}
                    </p>
                  </div>
                ) : null
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Audio Passage Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Listening Passage</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={togglePlayback}
                className="flex items-center gap-1"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleStartEditingPassage}
                className="flex items-center gap-1"
              >
                <Edit2 className="h-4 w-4" />
                Edit
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {editingPassage ? (
            <div className="space-y-4">
              <textarea
                value={passageText}
                onChange={(e) => setPassageText(e.target.value)}
                className="w-full h-32 p-3 border rounded-md resize-none"
                placeholder="Enter the listening passage text..."
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSavePassage}>
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancelEditingPassage}>
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-gray-700 whitespace-pre-wrap">
                {currentPassage || 'No passage text available. Click Edit to add passage.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conversations Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Conversations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Audio Player */}
            {audioUrl && (
              <div className="mb-4 flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePlayPauseAudio}
                  className="flex items-center gap-1"
                >
                  {isQuestionAudioPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isQuestionAudioPlaying ? 'Pause' : 'Play'}
                </Button>
                <audio ref={audioRef} src={audioUrl} preload="auto" />
                <span className="text-gray-500 text-sm">Audio for this part</span>
              </div>
            )}
            {previewData.conversations?.map((conversation, index) => (
              <div key={conversation.id || index} className="p-4 border rounded-lg">
                {editingConversationIndex === index ? (
                  <div className="space-y-4">
                    {/* Conversation Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <Input
                        value={editingData?.title || ''}
                        onChange={e => handleInputChange('title', e.target.value)}
                        placeholder="Conversation title"
                      />
                    </div>

                    {/* Context */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Context</label>
                      <Input
                        value={editingData?.context || ''}
                        onChange={e => handleInputChange('context', e.target.value)}
                        placeholder="Conversation context"
                      />
                    </div>

                    {/* Segments */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Conversation Segments</label>
                      {editingData?.segments?.map((segment, segIndex) => (
                        <div key={segment.id} className="mb-4 p-3 border rounded">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Speaker: {segment.speaker}</span>
                            <span className="text-xs text-gray-500">Order: {segment.order}</span>
                          </div>
                          <Input
                            value={segment.text}
                            onChange={e => handleSegmentChange(segment.id, 'text', e.target.value)}
                            className="w-full mb-2"
                            placeholder="Segment text"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Question */}
                    <div className="border-t pt-4 mt-4">
                      <h4 className="font-medium mb-2">Question</h4>
                      <Input
                        value={editingData?.question?.text || ''}
                        onChange={e => handleQuestionChange('text', e.target.value)}
                        className="mb-3"
                        placeholder="Question text"
                      />
                      
                      <div className="space-y-2">
                        {Object.entries(editingData?.question?.options || {}).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-2">
                            <span className="font-medium text-gray-700 w-6">{key}.</span>
                            <Input
                              value={value as string}
                              onChange={e => handleOptionChange(key, e.target.value)}
                              className="flex-1"
                              placeholder={`Option ${key}`}
                            />
                            <input
                              type="radio"
                              checked={editingData?.question?.answer === key}
                              onChange={() => handleQuestionChange('answer', key)}
                              className="ml-2"
                              name={`answer-${editingData?.id}`}
                            />
                            <span className="text-xs text-gray-500">Correct</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                      <Button size="sm" variant="outline" onClick={handleCancelEditing}>
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSave}>
                        <Save className="h-4 w-4 mr-1" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{conversation.title}</h4>
                        <p className="text-sm text-gray-600">{conversation.context}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                          {conversation.difficulty}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStartEditing(index)}
                        className="mt-1"
                      >
                        <Edit2 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>

                    {/* Conversation Segments */}
                    <div className="border-l-2 border-gray-200 pl-4 space-y-4">
                      {conversation.segments?.map((segment) => (
                        <div key={segment.id} className="text-sm">
                          <div className="font-medium text-blue-700">{segment.speaker}</div>
                          <p className="text-gray-700">{segment.text}</p>
                        </div>
                      ))}
                    </div>

                    {/* Question */}
                    <div className="mt-4 pt-4 border-t">
                      <h5 className="font-medium text-gray-900 mb-2">Question</h5>
                      <p className="text-gray-700 mb-3">{conversation.question.text}</p>
                      <div className="space-y-2">
                        {Object.entries(conversation.question.options || {}).map(([key, value]) => (
                          <div 
                            key={key} 
                            className={`flex items-center gap-2 p-2 rounded ${
                              conversation.question.answer === key 
                                ? 'bg-green-50 border border-green-200' 
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <span 
                              className={`font-medium w-6 text-center ${
                                conversation.question.answer === key 
                                  ? 'text-green-600' 
                                  : 'text-gray-500'
                              }`}
                            >
                              {key}.
                            </span>
                            <span className="text-gray-700">
                              {value as string}
                            </span>
                            {conversation.question.answer === key && (
                              <span className="ml-auto text-sm text-green-600">
                                ✓ Correct Answer
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ListeningPart1; 