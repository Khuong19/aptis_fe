'use client';

import React, { useState } from 'react';
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/basic';
import { Edit2, Save, X, Play, Pause } from 'lucide-react';
import toast from 'react-hot-toast';

interface Question {
  id: string;
  text: string;
  options: Record<string, string>;
  answer: string;
  paragraph?: string;
}

interface Lecture {
  id: string;
  topic: string;
  speaker: string;
  audioText: string;
  questions: Question[];
  audioUrl?: string;
}

import { Question as BaseQuestion, QuestionOption as BaseQuestionOption } from '@/app/types/question-bank';

type OptionsType = Record<string, string> | BaseQuestionOption[];

// This Question interface matches the JSON structure for Listening Part 4
interface Question {
  id: string;
  text: string;
  options: Record<string, string>;
  answer: string;
  paragraph?: string;
}

interface Lecture {
  id: string;
  topic: string;
  speaker: string;
  audioText: string;
  questions: Question[];
  audioUrl?: string;
}

// If you ever need to convert from a shape where options is an array, use this:
export function normalizeLectureQuestions(lectures: any[]): Lecture[] {
  return lectures.map((lecture) => ({
    ...lecture,
    questions: (lecture.questions || []).map((q: any) => ({
      ...q,
      options: Array.isArray(q.options)
        ? Object.fromEntries(q.options.map((opt: any) => [opt.key, opt.value]))
        : q.options,
    })),
  }));
}

type PreviewData = {
  title?: string;
  description?: string;
  type?: string;
  part: number;
  level?: string;
  lectures: Lecture[];
  audioFiles?: string[];
  passageText?: string;
  passage?: string;
  questions: Question[];
  [key: string]: any; // Allow additional properties
};

interface ListeningPart4Props {
  previewData: PreviewData;
  onEdit?: (data: PreviewData) => void;
}

const ListeningPart4: React.FC<ListeningPart4Props> = ({ previewData, onEdit }) => {
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<any>(null);
  const [editingPassage, setEditingPassage] = useState(false);
  const [passageText, setPassageText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isQuestionAudioPlaying, setIsQuestionAudioPlaying] = useState(false);

  // --- AUDIO PLAYER FOR QUESTIONS SECTION ---
  // Ưu tiên lấy audioUrl từ lectures, nếu không có thì lấy từ audioFiles[0]
  const audioUrl = (previewData?.lectures && Array.isArray(previewData.lectures) && previewData.lectures[0]?.audioUrl) || 
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

  // Extract passage text if available
  const currentPassage = previewData?.passageText || previewData?.passage || '';

  const handleStartEditing = (idx: number) => {
    setEditingQuestionIndex(idx);
    setEditingData({ ...previewData.questions[idx] });
  };

  const handleCancelEditing = () => {
    setEditingQuestionIndex(null);
    setEditingData(null);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditingData({ ...editingData, [field]: value });
  };

  const handleOptionChange = (key: string, value: string) => {
    setEditingData({
      ...editingData,
      options: { ...editingData.options, [key]: value },
    });
  };

  const handleAnswerChange = (value: string) => {
    setEditingData({ ...editingData, answer: value });
  };

  const handleSave = () => {
    if (!onEdit || editingQuestionIndex === null || !editingData) return;
    
    const updatedQuestions = [...(previewData.questions || [])];
    updatedQuestions[editingQuestionIndex] = editingData;
    
    onEdit({
      ...previewData,
      questions: updatedQuestions as Question[]
    });
    
    setEditingQuestionIndex(null);
    setEditingData(null);
    toast.success('Question updated successfully!');
  };

  const handleStartEditingPassage = () => {
    setPassageText(currentPassage);
    setEditingPassage(true);
  };

  const handleSavePassage = () => {
    if (!onEdit) return;
    onEdit({ ...previewData, passageText: passageText });
    setEditingPassage(false);
    toast.success('Passage updated successfully!');
  };

  const handleCancelEditingPassage = () => {
    setEditingPassage(false);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    toast.success(isPlaying ? 'Audio paused' : 'Audio playing');
  };

  // Extract lectures data
  const lectures = previewData?.lectures || [];

  return (
    <div className="space-y-6">
      {/* Lectures Section */}
      {lectures.length > 0 ? (
        <div className="space-y-6">
          {lectures.map((lecture, index) => (
            <Card key={lecture.id || index} className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold">
                      Lecture {index + 1}: {lecture.topic}
                    </CardTitle>
                    <p className="text-sm text-gray-500 mt-1">Speaker: {lecture.speaker}</p>
                  </div>
                  {lecture.audioUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const audio = new Audio(lecture.audioUrl);
                        audio.play();
                      }}
                      className="flex items-center gap-1"
                    >
                      <Play className="h-4 w-4" />
                      Play Audio
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Audio Text */}
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="font-medium text-gray-800 mb-2">Audio Text</h4>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {lecture.audioText}
                    </p>
                  </div>

                  {/* Questions */}
                  {lecture.questions?.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Questions</h4>
                      {lecture.questions.map((question, qIndex) => (
                        <div key={question.id || qIndex} className="border rounded-lg p-4">
                          <p className="font-medium text-gray-800 mb-3">
                            {qIndex + 1}. {question.text}
                          </p>
                          <div className="space-y-2">
{(() => {
                              const optionsMap = Array.isArray(question.options)
                                ? question.options.reduce<Record<string, string>>((acc, opt) => ({
                                    ...acc,
                                    [opt.id]: opt.text
                                  }), {})
                                : question.options as Record<string, string>;

                              return Object.entries(optionsMap).map(([key, value]) => (
<div 
                                key={key}
                                className={`flex items-start p-2 rounded ${
                                  question.answer === key 
                                    ? 'bg-green-50 border border-green-200' 
                                    : 'bg-gray-50'
                                }`}
                              >
                                <span className="font-medium w-6">{key}.</span>
                                <span className="flex-1">{String(value)}</span>
                                {question.answer === key && (
                                  <span className="text-green-500 ml-2">
                                    ✓ Correct
                                  </span>
                                )}
                              </div>
                            ));
                            })()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No lectures available. Please add lectures to this part.
        </div>
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

      
    </div>
  );
};

export default ListeningPart4;