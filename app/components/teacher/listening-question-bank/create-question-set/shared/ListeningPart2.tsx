'use client';

import React, { useState } from 'react';
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/basic';
import { Edit2, Save, X, Play, Pause } from 'lucide-react';
import toast from 'react-hot-toast';

interface ListeningPart2Props {
  previewData: any;
  onEdit: (data: any) => void;
}

const ListeningPart2: React.FC<ListeningPart2Props> = ({ previewData, onEdit }) => {
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<any>(null);
  const [editingPassage, setEditingPassage] = useState(false);
  const [passageText, setPassageText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);


  let reasons: string[] = [];
  if (previewData?.monologue?.options && Array.isArray(previewData.monologue.options)) {
    reasons = previewData.monologue.options;
  } else if (previewData?.monologue?.reasons && Array.isArray(previewData.monologue.reasons)) {
    reasons = previewData.monologue.reasons;
  } else if (previewData?.questions && Array.isArray(previewData.questions)) {
    reasons = previewData.questions.map((q: any) => q.text || q.reason || q.sentence || '');
  }
  reasons = Array.from(new Set(reasons)).filter(r => r && r.trim() !== '');
  
  // Nếu không có reasons hoặc ít hơn 6, dùng default options
  if (reasons.length < 6) {
    reasons = [
      'dislikes online shopping',
      'thinks before purchasing', 
      'spends a lot of money',
      'is an impulse buyer',
      'only shops during certain periods',
      'prefers to shop alone'
    ];
  }
  
  const reasonLabels = reasons.map((r, i) => String.fromCharCode(65 + i));

  const numQuestions = 4; // Part 2 luôn có 4 câu hỏi
  const [selected, setSelected] = useState<(string | undefined)[]>(Array(numQuestions).fill(undefined));

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
    setIsPlaying(!isPlaying);
    toast.success(isPlaying ? 'Audio paused' : 'Audio playing');
  };

  // --- AUDIO PLAYER FOR QUESTIONS SECTION ---
  // Ưu tiên lấy audioUrl từ monologue, nếu không có thì lấy từ audioFiles[0]
  const audioUrl = previewData?.monologue?.audioUrl || (Array.isArray(previewData?.audioFiles) ? previewData.audioFiles[0] : undefined);
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
      {/* Audio Text Section */}
      {previewData?.monologue?.audioText && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Audio Text</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-gray-700 whitespace-pre-wrap">
                {previewData.monologue.audioText}
              </p>
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