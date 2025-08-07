'use client';

import React, { useState } from 'react';
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/basic';
import { Edit2, Save, X, Play, Pause, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

interface ListeningPart3Props {
  previewData: any;
  onEdit: (data: any) => void;
}

const ListeningPart3: React.FC<ListeningPart3Props> = ({ previewData, onEdit }) => {
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<any>(null);
  const [editingPassage, setEditingPassage] = useState(false);
  const [passageText, setPassageText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isQuestionAudioPlaying, setIsQuestionAudioPlaying] = useState(false);
  const [showJsonData, setShowJsonData] = useState(false);


  const audioUrl = (previewData?.speakers && Array.isArray(previewData.speakers) && previewData.speakers[0]?.audioUrl) || 
                   (Array.isArray(previewData?.audioFiles) ? previewData.audioFiles[0] : undefined);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const handlePlayPauseAudio = () => {
    if (!audioRef.current) return;
    if (isQuestionAudioPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  React.useEffect(() => {
    if (!audioRef.current) return;
    const onEnded = () => setIsQuestionAudioPlaying(false);
    const onPlay = () => setIsQuestionAudioPlaying(true);
    const onPause = () => setIsQuestionAudioPlaying(false);
    audioRef.current.addEventListener('ended', onEnded);
    audioRef.current.addEventListener('play', onPlay);
    audioRef.current.addEventListener('pause', onPause);
    return () => {
      audioRef.current?.removeEventListener('ended', onEnded);
      audioRef.current?.removeEventListener('play', onPlay);
      audioRef.current?.removeEventListener('pause', onPause);
    };
  }, []);

  // Extract discussion and questions from the new structure
  const discussion = previewData?.discussion || [];
  const questions = previewData?.questions || [];
  const title = previewData?.title || 'Listening Part 3';
  const description = previewData?.description || 'Listen to the discussion and answer the questions below.';

  // Group discussion by speaker for better display
  const discussionBySpeaker = discussion.reduce((acc: any, item: any) => {
    if (!acc[item.speaker]) {
      acc[item.speaker] = [];
    }
    acc[item.speaker].push(item.text);
    return acc;
  }, {});

  const handleStartEditing = (idx: number) => {
    setEditingQuestionIndex(idx);
    setEditingData({ ...questions[idx] });
  };

  const handleCancelEditing = () => {
    setEditingQuestionIndex(null);
    setEditingData(null);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditingData({ ...editingData, [field]: value });
  };

  const handleSave = () => {
    if (!onEdit) return;
    const updatedQuestions = [...questions];
    updatedQuestions[editingQuestionIndex!] = editingData;
    onEdit({ ...previewData, questions: updatedQuestions });
    setEditingQuestionIndex(null);
    setEditingData(null);
    toast.success('Question updated successfully!');
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    toast.success(isPlaying ? 'Audio paused' : 'Audio playing');
  };

  // --- Voice selection for passages ---
  // This is kept for backward compatibility but not used in the new structure
  const voiceOptions = [
    { value: 'men', label: 'Men' },
    { value: 'woman', label: 'Woman' },
  ];
  // --- END ---

  return (
    <div className="space-y-6">

      {/* Title and Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{description}</p>
        </CardContent>
      </Card>

      {/* Discussion Section */}
      {Object.keys(discussionBySpeaker).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Discussion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(discussionBySpeaker).map(([speaker, texts]: [string, any]) => (
                <div key={speaker} className="bg-gray-50 p-4 rounded-md">
                  <div className="font-medium text-blue-700 mb-2">{speaker}</div>
                  <div className="space-y-2">
                    {texts.map((text: string, idx: number) => (
                      <p key={idx} className="text-gray-700 pl-4 border-l-2 border-blue-200">
                        {text}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Audio Player Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Audio Player</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={togglePlayback}
                className="flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {audioUrl && (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePlayPauseAudio}
                className="flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isQuestionAudioPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isQuestionAudioPlaying ? 'Pause' : 'Play'}
              </Button>
              <audio ref={audioRef} src={audioUrl} preload="auto" />
              <span className="text-gray-500 text-sm">Audio for this part</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Questions Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-3 font-medium text-gray-700">Who expresses which opinion?</div>
          
          <div className="space-y-6">
            {questions.map((question: any, index: number) => {
              const options = question.options || {
                A: 'Man',
                B: 'Woman',
                C: 'Both'
              };
              
              return (
                <div key={question.id || index} className="space-y-2">
                  <div className="flex items-start gap-3">
                    <span className="font-medium mt-1">{index + 1}.</span>
                    <div className="flex-1">
                      <p className="text-gray-800 mb-2">{question.text}</p>
                      <div className="space-y-2 mt-2">
                        {Object.entries(options).map(([key, optionValue]) => {
                          const isCorrect = question.answer === key;
                          return (
                            <div 
                              key={key}
                              className={`flex items-center p-2 rounded ${
                                isCorrect ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                              }`}
                            >
                              <span className="font-medium w-6">{key}.</span>
                              <span className="flex-1">{String(optionValue)}</span>
                              {isCorrect && (
                                <span className="text-green-500 ml-2">
                                  ✓
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      {question.correctPerson && (
                        <div className="mt-2 text-sm text-gray-600">
                          Correct answer: <span className="font-medium">{question.correctPerson}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ListeningPart3; 