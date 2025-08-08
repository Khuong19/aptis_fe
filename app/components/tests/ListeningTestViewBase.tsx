'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMergedAudioUrl } from '@/app/lib/api/audioService';

type Mode = 'learner' | 'teacher';

export interface ListeningTestViewBaseProps {
  test: any;
  mode: Mode;
  onTestComplete?: (answers: Record<string, string>, timeSpent: number) => void;
}

const DEFAULT_DURATION = 25 * 60; // 25 minutes

export default function ListeningTestViewBase({ test, mode, onTestComplete }: ListeningTestViewBaseProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(test?.duration || DEFAULT_DURATION);
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [startTime] = useState<number>(Date.now());
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [currentLectureIndex, setCurrentLectureIndex] = useState(0);
  // Part 3 specific states (always declared to keep hook order stable)
  const [audioSrcPart3, setAudioSrcPart3] = useState<string>('/audio/sample.mp3');
  const [isLoadingAudioPart3, setIsLoadingAudioPart3] = useState<boolean>(true);

  const audioRef = useRef<HTMLAudioElement>(null);
  const router = useRouter();

  const questionSets = test?.questionSets || [];
  const totalParts = questionSets.length;
  const currentQuestionSet = questionSets[currentPartIndex];

  // Determine if current view is the final step of the whole preview/test
  const isFinalStep = (() => {
    if (!currentQuestionSet) return true;
    const isLastPart = currentPartIndex === totalParts - 1;
    if (!isLastPart) return false;
    switch (currentQuestionSet.part) {
      case 1: {
        const conversations = currentQuestionSet.conversations || [];
        return conversations.length === 0 || currentQuestionIndex >= conversations.length - 1;
      }
      case 4: {
        const lectures = currentQuestionSet.lectures || [];
        return lectures.length === 0 || currentLectureIndex >= lectures.length - 1;
      }
      default:
        return true;
    }
  })();

  useEffect(() => {
    if (mode === 'teacher') return; // Không đếm giờ trong chế độ preview
    if (timeLeft <= 0 && !isTestComplete) {
      handleTestComplete();
    }
    if (timeLeft > 0 && !isTestComplete) {
      const timer = setInterval(() => setTimeLeft((t: number) => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, isTestComplete, mode]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const updateTime = () => setAudioCurrentTime(audio.currentTime);
      const updateDuration = () => setAudioDuration(audio.duration);

      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', updateDuration);
      audio.addEventListener('ended', () => setIsPlaying(false));
      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadedmetadata', updateDuration);
        audio.removeEventListener('ended', () => setIsPlaying(false));
      };
    }
  }, [currentPartIndex, currentLectureIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio && currentQuestionSet?.part === 4) {
      audio.load();
      setIsPlaying(false);
      setAudioCurrentTime(0);
    }
  }, [currentLectureIndex, currentQuestionSet?.part]);

  // Load merged audio for Part 3 (hooks kept at top-level, effect guards on part check)
  useEffect(() => {
    const loadMergedAudio = async () => {
      if (!currentQuestionSet || currentQuestionSet.part !== 3) return;
      try {
        setIsLoadingAudioPart3(true);
        const mergedAudioUrl = await getMergedAudioUrl(currentQuestionSet);
        setAudioSrcPart3(mergedAudioUrl);
      } catch (error) {
        const audioFile = currentQuestionSet.audioFiles?.[0];
        setAudioSrcPart3(
          audioFile
            ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${audioFile.replace('http://localhost:5000/api/uploads/', '')}`
            : '/audio/sample.mp3'
        );
      } finally {
        setIsLoadingAudioPart3(false);
      }
    };
    loadMergedAudio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionSet]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) audio.pause();
      else audio.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleAnswerSelect = (questionKey: string, answer: string) => {
    if (mode === 'teacher') return; // preview không chọn đáp án
    setSelectedAnswers((prev) => ({ ...prev, [questionKey]: answer }));
  };

  const handleBookmark = (questionKey: string) => {
    // Bỏ bookmark trong preview để đơn giản (không lưu state)
    if (mode === 'teacher') return;
  };

  const handleNext = () => {
    if (currentQuestionSet?.part === 1) {
      const conversations = currentQuestionSet.conversations || [];
      if (currentQuestionIndex < conversations.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        return;
      }
    }

    if (currentQuestionSet?.part === 4) {
      const lectures = currentQuestionSet.lectures || [];
      if (currentLectureIndex < lectures.length - 1) {
        setCurrentLectureIndex((prev) => prev + 1);
        return;
      }
    }

    if (currentPartIndex < totalParts - 1) {
      setCurrentPartIndex((prev) => prev + 1);
      setCurrentQuestionIndex(0);
      setCurrentLectureIndex(0);
    } else if (mode === 'learner') {
      handleTestComplete();
    }
  };

  const handleBack = () => {
    if (currentQuestionSet?.part === 1) {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex((prev) => prev - 1);
        return;
      }
    }
    if (currentQuestionSet?.part === 4) {
      if (currentLectureIndex > 0) {
        setCurrentLectureIndex((prev) => prev - 1);
        return;
      }
    }
    if (currentPartIndex > 0) {
      setCurrentPartIndex((prev) => prev - 1);
      setCurrentQuestionIndex(0);
      setCurrentLectureIndex(0);
    }
  };

  const handleTestComplete = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    setIsTestComplete(true);
    if (mode === 'learner' && onTestComplete) {
      onTestComplete(selectedAnswers, timeSpent);
    }
  };

  const renderListeningPart1 = (questionSet: any) => {
    const conversations = questionSet.conversations || [];
    const currentConversation = conversations[currentQuestionIndex] || {};
    const questionKey = `${questionSet.id}-conv${currentQuestionIndex}`;

    if (!currentConversation.question) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">No question available</p>
        </div>
      );
    }

    const correctAnswer = currentConversation?.question?.answer || 'A';
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm font-medium mb-2">
            {currentConversation.title} - {currentConversation.context}
          </p>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center space-x-4">
            <button onClick={handlePlayPause} className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600">
              {isPlaying ? '⏸️' : '▶️'}
            </button>
            <span className="text-sm">Play/Stop</span>
          </div>
          <audio ref={audioRef} src={currentConversation.audioUrl || '/audio/sample.mp3'} preload="metadata" />
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-medium">{currentConversation.question.text}</h3>
          </div>
          <div className="space-y-3">
            {currentConversation.question.options &&
              Object.entries(currentConversation.question.options).map(([key, value]) => (
                <label key={key} className={`flex items-center p-3 border rounded-lg ${(mode === 'teacher' ? correctAnswer : selectedAnswers[questionKey]) === key ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded border flex items-center justify-center font-medium">{key}</div>
                    <span>{value as string}</span>
                  </div>
                  <input type="radio" name={questionKey} value={key} checked={(mode === 'teacher' ? correctAnswer : selectedAnswers[questionKey]) === key} onChange={(e) => handleAnswerSelect(questionKey, e.target.value)} className="ml-auto" disabled={mode === 'teacher'} />
                </label>
              ))}
          </div>
        </div>

        <div className="flex justify-center items-center">
          <span className="text-sm text-gray-600">Question {currentQuestionIndex + 1} of {conversations.length}</span>
        </div>
      </div>
    );
  };

  const renderListeningPart2 = (questionSet: any) => {
    const monologue = questionSet.monologue;
    if (!monologue) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">No monologue available</p>
        </div>
      );
    }
    const questions = monologue.questions || [];
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm font-medium mb-2">{monologue.introduction}</p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center space-x-4">
            <button onClick={handlePlayPause} className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600">{isPlaying ? '⏸️' : '▶️'}</button>
            <span className="text-sm">Play/Stop</span>
          </div>
          <audio ref={audioRef} src={questionSet.monologue?.audioUrl || '/audio/sample.mp3'} preload="metadata" />
        </div>
        <div className="bg-white border rounded-lg p-6 space-y-4">
          {questions.map((question: any, index: number) => {
            const questionKey = `${questionSet.id}-q${index}`;
            const options = {
              A: questions[0]?.sentence,
              B: questions[1]?.sentence,
              C: questions[2]?.sentence,
              D: questions[3]?.sentence,
            };
            return (
              <div key={index} className="flex items-center space-x-3">
                <span className="font-medium min-w-[100px]">{question.text} ...</span>
                <select
                  className="flex-1 p-2 border border-gray-300 rounded"
                  value={mode === 'teacher' ? (question?.answer || 'A') : (selectedAnswers[questionKey] || '')}
                  onChange={(e) => handleAnswerSelect(questionKey, e.target.value)}
                  disabled={mode === 'teacher'}
                >
                  <option value="">Select...</option>
                  {Object.entries(options).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value as string}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderListeningPart3 = (questionSet: any) => {
    const questions = questionSet.questions || [];

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium mb-2">Listen to two people discussing work arrangements. Read the opinions below and decide whose opinion matches the statements: the man, the woman, or both.</p>
          </div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center space-x-4">
            <button onClick={handlePlayPause} disabled={isLoadingAudioPart3} className={`w-10 h-10 rounded-full flex items-center justify-center ${isLoadingAudioPart3 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}>{isLoadingAudioPart3 ? '⏳' : isPlaying ? '⏸️' : '▶️'}</button>
            <span className="text-sm">{isLoadingAudioPart3 ? 'Loading audio...' : 'Play/Stop'}</span>
          </div>
          <audio ref={audioRef} src={audioSrcPart3} preload="metadata" />
        </div>
        <div className="bg-white border rounded-lg p-6">
          <h3 className="font-medium mb-4">Who expresses which opinion?</h3>
          <div className="space-y-4">
            {questions.map((question: any, index: number) => {
              const questionKey = `${questionSet.id}-q${index}`;
              return (
                <div key={index} className="flex items-center space-x-3">
                  <span className="font-medium w-6">{index + 1}.</span>
                  <span className="flex-1">{question.text}</span>
                  <select className="min-w-[150px] p-2 border border-gray-300 rounded" value={mode === 'teacher' ? (question?.answer || 'A') : (selectedAnswers[questionKey] || '')} onChange={(e) => handleAnswerSelect(questionKey, e.target.value)} disabled={mode === 'teacher'}>
                    <option value="">Select...</option>
                    {question.options && Object.entries(question.options).map(([key, value]) => (
                      <option key={key} value={key}>{value as string}</option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderListeningPart4 = (questionSet: any) => {
    const lectures = questionSet.lectures || [];
    const currentLecture = lectures[currentLectureIndex];
    if (!currentLecture) {
      return (
        <div className="max-w-4xl mx-auto text-center py-8">
          <p className="text-gray-500">No lecture available</p>
        </div>
      );
    }
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium text-lg">Lecture {currentLectureIndex + 1} of {lectures.length}</h3>
              <p className="text-sm text-gray-600 mt-1">Topic: {currentLecture.topic}</p>
              {currentLecture.speaker && <p className="text-sm text-gray-500">Speaker: {currentLecture.speaker}</p>}
            </div>
          </div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center space-x-4">
            <button onClick={handlePlayPause} className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600">{isPlaying ? '⏸️' : '▶️'}</button>
            <span className="text-sm">Play/Stop</span>
            <span className="text-sm text-gray-500">{formatTime(audioCurrentTime)} / {formatTime(audioDuration)}</span>
          </div>
          <audio ref={audioRef} src={questionSet.audioFiles && questionSet.audioFiles[currentLectureIndex] ? `${process.env.NEXT_PUBLIC_API_URL}/${questionSet.audioFiles[currentLectureIndex].replace('http://localhost:5000/api/', '')}` : '/audio/sample.mp3'} preload="metadata" />
        </div>
        <div className="space-y-6">
          {currentLecture.questions && currentLecture.questions.map((question: any, index: number) => {
            const questionKey = `${questionSet.id}-${currentLecture.topic}-q${index}`;
            return (
              <div key={index} className="bg-white border rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium">{question.text}</h3>
                    <p className="text-sm text-gray-500 mt-1">Question {index + 1} of {currentLecture.questions.length}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {question.options && Object.entries(question.options).map(([key, value]) => (
                    <label key={key} className={`flex items-center p-3 border rounded-lg ${(mode === 'teacher' ? (question?.answer || 'A') : selectedAnswers[questionKey]) === key ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="w-8 h-8 bg-gray-100 rounded border flex items-center justify-center font-medium">{key}</div>
                        <span>{value as string}</span>
                      </div>
                      <input type="radio" name={questionKey} value={key} checked={(mode === 'teacher' ? (question?.answer || 'A') : selectedAnswers[questionKey]) === key} onChange={(e) => handleAnswerSelect(questionKey, e.target.value)} className="ml-auto" disabled={mode === 'teacher'} />
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderCurrentPart = () => {
    if (!currentQuestionSet) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">No part available</p>
        </div>
      );
    }
    switch (currentQuestionSet.part) {
      case 1:
        return renderListeningPart1(currentQuestionSet);
      case 2:
        return renderListeningPart2(currentQuestionSet);
      case 3:
        return renderListeningPart3(currentQuestionSet);
      case 4:
        return renderListeningPart4(currentQuestionSet);
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Unsupported part</p>
          </div>
        );
    }
  };

  if (!test) return null;

  return (
    <div className={mode === 'learner' ? 'h-screen flex flex-col bg-gray-100' : 'min-h-screen bg-gray-50 flex flex-col'}>
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {mode === 'learner' ? (
                <>
                  <button onClick={() => router.push('/learner/practice')} className="px-3 py-1 text-sm rounded border border-gray-300 text-gray-700 hover:bg-gray-50">← Back to Practice</button>
                  <div className="flex items-center space-x-2 text-lg font-medium">
                    <span className={`${timeLeft <= 300 ? 'text-red-600' : 'text-gray-600'}`}>{formatTime(timeLeft)}</span>
                    {timeLeft <= 300 && <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Time remaining</span>}
                  </div>
                </>
              ) : (
                <div className="text-lg font-medium text-gray-700">Listening Test Preview</div>
              )}
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">A</span>
                </div>
                <span className="font-medium">AptisWeb</span>
              </div>
              <span className="font-medium text-gray-600">Listening</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="font-medium">Part {currentPartIndex + 1} of {totalParts}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6">{renderCurrentPart()}</div>
      </div>

      <div className="bg-white border-t shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button onClick={handleBack} disabled={currentPartIndex === 0 && (currentQuestionIndex === 0 && currentLectureIndex === 0)} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
            <div className="flex items-center space-x-4">
              {mode === 'teacher' ? (
                !isFinalStep ? (
                  <button onClick={handleNext} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Next</button>
                ) : (
                  <button onClick={() => router.back()} className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900">Close Preview</button>
                )
              ) : (
                <button onClick={isFinalStep ? handleTestComplete : handleNext} className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">{isFinalStep ? 'Submit Test' : 'Next'}</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


