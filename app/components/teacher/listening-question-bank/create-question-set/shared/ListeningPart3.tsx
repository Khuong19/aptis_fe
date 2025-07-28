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

  // --- AUDIO PLAYER FOR QUESTIONS SECTION ---
  // Ưu tiên lấy audioUrl từ speakers, nếu không có thì lấy từ audioFiles[0]
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

  // Extract passages and questions
  const passages = previewData?.passages || [];
  const questions = previewData?.questions || [];

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

  // --- Giọng đọc cho passage: chỉ cho chọn men hoặc woman ---
  // Nếu passages có trường voice/gender thì cho phép chỉnh, nếu không thì bỏ qua
  const handlePassageVoiceChange = (idx: number, value: string) => {
    if (!onEdit) return;
    const updatedPassages = passages.map((p: any, i: number) =>
      i === idx ? { ...p, voice: value } : p
    );
    onEdit({ ...previewData, passages: updatedPassages });
  };
  const voiceOptions = [
    { value: 'men', label: 'Men' },
    { value: 'woman', label: 'Woman' },
  ];
  // --- END ---

  return (
    <div className="space-y-6">
      {/* Audio Text Section */}
      {previewData?.discussion && Array.isArray(previewData.discussion) && 
       previewData.discussion.some((disc: any) => disc.text) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Audio Text</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {previewData.discussion.map((disc: any, index: number) => 
                disc.text ? (
                  <div key={index} className="bg-gray-50 p-4 rounded-md">
                    <div className="text-sm font-medium text-gray-800 mb-2">
                      Discussion {index + 1}
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {disc.text}
                    </p>
                  </div>
                ) : null
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Audio Passages Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Listening Passages</CardTitle>
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
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
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
            {passages.map((passage: any, index: number) => (
              <div key={passage.id || index} className="p-4 border rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  Passage {index + 1} - {passage.person || `Person ${index + 1}`}
                </h4>
                <p className="text-gray-700 mb-2">{passage.text}</p>
                {/* Chọn giọng đọc cho passage */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-gray-600">Voice:</span>
                  <select
                    className="border rounded px-2 py-1"
                    value={passage.voice || ''}
                    onChange={e => handlePassageVoiceChange(index, e.target.value)}
                  >
                    <option value="">-- Select --</option>
                    {voiceOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Questions Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 text-base text-gray-800">
            Listen to two teachers discussing potential modifications to their language school. Read the statements and decide whose opinion matches the best: the man's, the woman's or both.
          </div>
          <div className="mb-3 font-medium text-gray-700">Who expresses which opinion?</div>
          
          <div className="space-y-3">
            {questions.map((question: any, index: number) => (
              <div key={question.id || index} className="flex items-center gap-4">
                <span className="font-medium min-w-[60px]">{index + 1}.{index + 1}</span>
                <span className="flex-1 text-gray-700">{question.text}</span>
                <select
                  className="border rounded px-3 py-2 bg-white min-w-[100px]"
                  value={question.correctPerson || question.answer || ''}
                  onChange={(e) => {
                    if (!onEdit) return;
                    const updatedQuestions = [...questions];
                    updatedQuestions[index] = { ...question, correctPerson: e.target.value, answer: e.target.value };
                    onEdit({ ...previewData, questions: updatedQuestions });
                  }}
                >
                  <option value="">-- Select --</option>
                  <option value="woman">Woman</option>
                  <option value="man">Man</option>
                  <option value="both">Both</option>
                </select>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ListeningPart3; 