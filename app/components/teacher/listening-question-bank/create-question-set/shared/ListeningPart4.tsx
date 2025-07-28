'use client';

import React, { useState } from 'react';
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/basic';
import { Edit2, Save, X, Play, Pause } from 'lucide-react';
import toast from 'react-hot-toast';

interface ListeningPart4Props {
  previewData: any;
  onEdit: (data: any) => void;
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

  // Extract passage text
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

  return (
    <div className="space-y-6">
      {/* Audio Text Section */}
      {previewData?.lectures && Array.isArray(previewData.lectures) && 
       previewData.lectures.some((lecture: any) => lecture.audioText) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Audio Text</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {previewData.lectures.map((lecture: any, index: number) => 
                lecture.audioText ? (
                  <div key={index} className="bg-gray-50 p-4 rounded-md">
                    <div className="text-sm font-medium text-gray-800 mb-2">
                      Lecture {index + 1}{lecture.title ? `: ${lecture.title}` : ''}
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {lecture.audioText}
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

      {/* Lectures Audio Preview Section */}
      {Array.isArray(previewData.lectures) && previewData.lectures.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Lectures Audio Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {previewData.lectures.map((lecture: any, idx: number) => {
                const [isLectureAudioPlaying, setIsLectureAudioPlaying] = React.useState(false);
                const lectureAudioRef = React.useRef<HTMLAudioElement>(null);
                const handlePlayPauseLectureAudio = () => {
                  if (!lectureAudioRef.current) return;
                  if (isLectureAudioPlaying) {
                    lectureAudioRef.current.pause();
                  } else {
                    lectureAudioRef.current.play();
                  }
                };
                React.useEffect(() => {
                  if (!lectureAudioRef.current) return;
                  const onEnded = () => setIsLectureAudioPlaying(false);
                  const onPlay = () => setIsLectureAudioPlaying(true);
                  const onPause = () => setIsLectureAudioPlaying(false);
                  lectureAudioRef.current.addEventListener('ended', onEnded);
                  lectureAudioRef.current.addEventListener('play', onPlay);
                  lectureAudioRef.current.addEventListener('pause', onPause);
                  return () => {
                    lectureAudioRef.current?.removeEventListener('ended', onEnded);
                    lectureAudioRef.current?.removeEventListener('play', onPlay);
                    lectureAudioRef.current?.removeEventListener('pause', onPause);
                  };
                }, []);
                return (
                  <div key={lecture.id || idx} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-gray-900 flex-1">
                        Lecture {idx + 1}{lecture.title ? `: ${lecture.title}` : ''}
                      </h4>
                      {lecture.audioUrl && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePlayPauseLectureAudio}
                            className="flex items-center gap-1"
                          >
                            {isLectureAudioPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                            {isLectureAudioPlaying ? 'Pause' : 'Play'}
                          </Button>
                          <audio ref={lectureAudioRef} src={lecture.audioUrl} preload="auto" />
                        </>
                      )}
                    </div>
                    {lecture.introduction && (
                      <div className="mb-2 text-gray-700 text-sm">{lecture.introduction}</div>
                    )}
                    {/* Danh sách câu hỏi của lecture này nếu có */}
                    {Array.isArray(lecture.questions) && lecture.questions.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {lecture.questions.map((q: any, qIdx: number) => (
                          <div key={q.id || qIdx} className="p-2 border rounded bg-white">
                            <div className="font-medium text-gray-900">Question {qIdx + 1}</div>
                            <div className="text-gray-700 mb-1">{q.text}</div>
                            <div className="space-y-1">
                              {q.options && Object.entries(q.options).map(([key, value]: [string, any]) => (
                                <div key={key} className="flex items-center gap-2">
                                  <span className={`font-medium w-6 ${q.answer === key ? 'text-green-600' : 'text-gray-500'}`}>{key}.</span>
                                  <span className={q.answer === key ? 'text-green-600 font-medium' : 'text-gray-700'}>{value}</span>
                                  {q.answer === key && <span className="text-green-600 text-xs">✓ Correct</span>}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Questions Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {previewData.questions?.map((question: any, index: number) => (
              <div key={`${question.id}-${index}`} className="p-4 border rounded-lg">
                {editingQuestionIndex === index ? (
                  <div className="space-y-2">
                    <Input
                      className="mb-2"
                      value={editingData?.text || ''}
                      onChange={e => handleInputChange('text', e.target.value)}
                      placeholder="Question text"
                    />
                    <Input
                      className="mb-2"
                      value={editingData?.paragraph || ''}
                      onChange={e => handleInputChange('paragraph', e.target.value)}
                      placeholder="Paragraph"
                    />
                    {Object.entries(editingData?.options || {}).map(([key, value]: [string, any]) => (
                      <div key={key} className="flex items-center gap-2">
                        <span className="font-medium text-gray-700 w-6">{key}.</span>
                        <Input
                          value={value || ''}
                          onChange={e => handleOptionChange(key, e.target.value)}
                          className="w-full"
                          placeholder={`Option ${key}`}
                        />
                        <input
                          type="radio"
                          checked={editingData?.answer === key}
                          onChange={() => handleAnswerChange(key)}
                          className="ml-2"
                          name={`answer-${index}`}
                        />
                        <span className="text-xs">Correct</span>
                      </div>
                    ))}
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" onClick={handleSave}>
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancelEditing}>
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">
                        Question {index + 1}
                      </h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStartEditing(index)}
                      >
                        <Edit2 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                    <p className="text-gray-700">{question.text}</p>
                    <p className="text-gray-600">Paragraph: {question.paragraph}</p>
                    <div className="space-y-1">
                      {Object.entries(question.options || {}).map(([key, value]: [string, any]) => (
                        <div key={key} className="flex items-center gap-2">
                          <span className={`font-medium w-6 ${
                            question.answer === key ? 'text-green-600' : 'text-gray-500'
                          }`}>
                            {key}.
                          </span>
                          <span className={`${
                            question.answer === key ? 'text-green-600 font-medium' : 'text-gray-700'
                          }`}>
                            {value}
                          </span>
                          {question.answer === key && (
                            <span className="text-green-600 text-sm">✓ Correct</span>
                          )}
                        </div>
                      ))}
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

export default ListeningPart4; 