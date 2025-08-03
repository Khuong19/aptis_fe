'use client';

import React, { useState } from 'react';
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/basic';
import { Edit2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import AudioPlayer from './AudioPlayer';

interface ListeningPart2Props {
  previewData: any;
  onEdit: (data: any) => void;
}

const ListeningPart2: React.FC<ListeningPart2Props> = ({ previewData, onEdit }) => {
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<any>(null);
  const [editingPassage, setEditingPassage] = useState(false);
  const [passageText, setPassageText] = useState('');

  let reasons: string[] = [];
  if (previewData?.monologue?.options && Array.isArray(previewData.monologue.options)) {
    reasons = previewData.monologue.options;
  } else if (previewData?.monologue?.reasons && Array.isArray(previewData.monologue.reasons)) {
    reasons = previewData.monologue.reasons;
  } else if (previewData?.questions && Array.isArray(previewData.questions)) {
    // Extract sentence text from questions if options not available
    reasons = previewData.questions.map((q: any) => q.sentence || q.text || q.reason || '');
  }
  reasons = Array.from(new Set(reasons)).filter(r => r && r.trim() !== '');
  
  
  const reasonLabels = reasons.map((r, i) => String.fromCharCode(65 + i));

  // Update numQuestions based on actual questions count
  const actualQuestionsCount = previewData?.questions?.length || 4;
  const numQuestions = Math.max(actualQuestionsCount, 4); // Minimum 4 questions
  const initialSelected = Array(numQuestions).fill(undefined);
  
  // Initialize selected answers from previewData.questions
  if (previewData?.questions) {
    previewData.questions.forEach((q: any) => {
      if (q.answer && q.position) {
        // Find the correct answer text from the options
        const answerText = q.sentence || q.text;
        console.log(`ListeningPart2 - question ${q.position}: answerText=${answerText}, answer=${q.answer}`);
        if (answerText) {
          initialSelected[q.position - 1] = answerText;
        } else if (q.answer) {
          // If we have an answer letter but no text, try to find it in the options
          const answerIndex = q.answer.charCodeAt(0) - 65; // Convert A->0, B->1, etc.
          if (reasons[answerIndex]) {
            initialSelected[q.position - 1] = reasons[answerIndex];
          }
        }
      }
    });
  }
  
  const [selected, setSelected] = useState<(string | undefined)[]>(initialSelected);
  
  // Update selected state when previewData changes (for preview mode)
  React.useEffect(() => {
    if (previewData?.questions) {
      const newSelected = [...initialSelected];
      let hasChanges = false;
      
      previewData.questions.forEach((q: any) => {
        if (q.answer && q.position) {
          const answerText = q.sentence || q.text;
          const position = q.position - 1;
          
          if (answerText && newSelected[position] !== answerText) {
            newSelected[position] = answerText;
            hasChanges = true;
          } else if (q.answer) {
            const answerIndex = q.answer.charCodeAt(0) - 65;
            if (reasons[answerIndex] && newSelected[position] !== reasons[answerIndex]) {
              newSelected[position] = reasons[answerIndex];
              hasChanges = true;
            }
          }
        }
      });
      
      if (hasChanges) {
        setSelected(newSelected);
      }
    }
  }, [previewData]);

  const handleSelect = (idx: number, value: string) => {
    setSelected(prev => {
      const updated = [...prev];
      updated[idx] = value;
      return updated;
    });
  };
  
  const getAvailableOptions = (idx: number) => {
    return reasons.map((r, i) => ({
      value: r,
      label: `${reasonLabels[i]}. ${r}`
    })).filter(opt => !selected.includes(opt.value) || selected[idx] === opt.value);
  };

  const introduction = previewData?.monologue?.introduction || previewData?.introduction ||
    'Four people are discussing their views on shopping. Complete the sentences. Use each answer only once. You will not need two of the reasons.';
    
  // Get monologue segments or use empty array if not available
  const segments = previewData?.monologue?.segments || [];
  
  // Debug logging for segments
  console.log('ListeningPart2 - segments:', segments);
  console.log('ListeningPart2 - segments length:', segments.length);

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

  const handleSave = () => {
    if (!onEdit) return;
    const updatedQuestions = [...previewData.questions];
    updatedQuestions[editingQuestionIndex!] = editingData;
    onEdit({ ...previewData, questions: updatedQuestions });
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
    // This function is now handled by AudioPlayer component
    toast.success('Audio playback controlled by AudioPlayer');
  };

  // --- AUDIO PLAYER FOR QUESTIONS SECTION ---

  // Get audio URL from previewData.audioFiles array
  const audioUrl = Array.isArray(previewData?.audioFiles) && previewData.audioFiles.length > 0 
    ? previewData.audioFiles[0] 
    : previewData?.monologue?.audioUrl;
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [isQuestionAudioPlaying, setIsQuestionAudioPlaying] = useState(false);

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

  return (
    <div className="space-y-6">
      {/* Monologue Segments */}
      {segments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Listening Segments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {segments.map((segment: any, idx: number) => (
              <div key={segment.id || idx} className="bg-gray-50 p-4 rounded-md">
                <div className="font-medium text-gray-700 mb-1">{segment.speaker || `Person ${idx + 1}`}</div>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {segment.text}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Audio Passage Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Listening Passage</CardTitle>
            <div className="flex items-center gap-2">
              <AudioPlayer 
                audioUrl={currentPassage ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/uploads/listening/sample/passage.mp3` : ''}
                label="Play Passage"
                size="sm"
                showLabel={true}
              />
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

      {/* Questions Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 text-base text-gray-800">{introduction}</div>
          {/* AUDIO PLAYER FOR QUESTIONS SECTION */}
          {audioUrl && (
            <div className="mb-4 flex items-center gap-3">
              <AudioPlayer 
                audioUrl={audioUrl || ''}
                label="Play Audio"
                size="sm"
                showLabel={true}
              />
              <span className="text-gray-500 text-sm">Audio for this part</span>
            </div>
          )}
          <div className="space-y-3">
            {[...Array(numQuestions)].map((_, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <span className="font-medium min-w-[80px]">Person {idx + 1}</span>
                <select
                  className="flex-1 border rounded px-3 py-2 bg-white min-h-[40px]"
                  value={selected[idx] || ''}
                  onChange={e => handleSelect(idx, e.target.value)}
                >
                  <option value="" className="text-gray-400">-- Select --</option>
                  {getAvailableOptions(idx).map((opt, i) => (
                    <option key={i} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ListeningPart2; 