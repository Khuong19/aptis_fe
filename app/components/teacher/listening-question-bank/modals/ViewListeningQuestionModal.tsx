'use client';

import { QuestionSet } from '@/app/types/question-bank';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/basic';
import { X, Headphones, Calendar, User, Play, Pause } from 'lucide-react';
import React from 'react';

interface ViewListeningQuestionModalProps {
  isOpen: boolean;
  questionSet: QuestionSet;
  onClose: () => void;
}

export default function ViewListeningQuestionModal({
  isOpen,
  questionSet,
  onClose
}: ViewListeningQuestionModalProps) {
  if (!isOpen || !questionSet) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPartLabel = (part: number) => {
    switch (part) {
      case 1: return 'Part 1 - Understanding Factual Information';
      case 2: return 'Part 2 - Understanding Factual Information';
      case 3: return 'Part 3 - Understanding Factual Information';
      case 4: return 'Part 4 - Understanding Factual Information';
      default: return `Part ${part}`;
    }
  };

  // --- AUDIO PLAYER FOR LISTENING SET ---
  // Get audioUrl based on part type
  const getAudioUrlForPart = () => {
    const part = questionSet.part;
    
    switch (part) {
      case 1:
        // Part 1: Get from conversations
        if ((questionSet as any)?.conversations && Array.isArray((questionSet as any).conversations)) {
          return (questionSet as any).conversations[0]?.audioUrl || (questionSet as any)?.audioFiles?.[0];
        }
        break;
      case 2:
        // Part 2: Get from monologue
        return (questionSet as any)?.monologue?.audioUrl || (questionSet as any)?.audioFiles?.[0];
      case 3:
        // Part 3: Get from speakers
        if ((questionSet as any)?.speakers && Array.isArray((questionSet as any).speakers)) {
          return (questionSet as any).speakers[0]?.audioUrl || (questionSet as any)?.audioFiles?.[0];
        }
        break;
      case 4:
        // Part 4: Get from lectures
        if ((questionSet as any)?.lectures && Array.isArray((questionSet as any).lectures)) {
          return (questionSet as any).lectures[0]?.audioUrl || (questionSet as any)?.audioFiles?.[0];
        }
        break;
    }
    
    return (questionSet as any)?.audioUrl || (questionSet as any)?.audioFiles?.[0];
  };

  const audioUrl = getAudioUrlForPart();
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [isAudioPlaying, setIsAudioPlaying] = React.useState(false);

  const handlePlayPauseAudio = () => {
    if (!audioRef.current) return;
    if (isAudioPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };
  React.useEffect(() => {
    if (!audioRef.current) return;
    const onEnded = () => setIsAudioPlaying(false);
    const onPlay = () => setIsAudioPlaying(true);
    const onPause = () => setIsAudioPlaying(false);
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Headphones className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold">View Listening Question Set</h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Question Set Info */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{questionSet.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Author: {questionSet.authorName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Created: {formatDate(questionSet.createdAt || new Date().toISOString())}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Part: </span>
                  <span className="text-sm text-gray-600">{getPartLabel(questionSet.part)}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Level: </span>
                  <span className="text-sm text-gray-600">{questionSet.level}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Questions: </span>
                  <span className="text-sm text-gray-600">{questionSet.questions?.length || 0}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Visibility: </span>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    questionSet.isPublic 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {questionSet.isPublic ? 'Public' : 'Private'}
                  </span>
                </div>
              </div>
              
              {/* Audio Text - Different locations based on part */}
              {(() => {
                let audioTexts: { title: string; text: string }[] = [];
                
                switch (questionSet.part) {
                  case 1:
                    if ((questionSet as any).conversations && Array.isArray((questionSet as any).conversations)) {
                      audioTexts = (questionSet as any).conversations
                        .map((conv: any, index: number) => ({
                          title: `Conversation ${index + 1}`,
                          text: conv.audioText || ''
                        }))
                        .filter((item: any) => item.text);
                    }
                    break;
                  case 2:
                    if ((questionSet as any).monologue?.audioText) {
                      audioTexts = [{
                        title: 'Monologue',
                        text: (questionSet as any).monologue.audioText
                      }];
                    }
                    break;
                  case 3:
                    if ((questionSet as any).discussion && Array.isArray((questionSet as any).discussion)) {
                      audioTexts = (questionSet as any).discussion
                        .map((disc: any, index: number) => ({
                          title: `Discussion ${index + 1}`,
                          text: disc.text || ''
                        }))
                        .filter((item: any) => item.text);
                    }
                    break;
                  case 4:
                    if ((questionSet as any).lectures && Array.isArray((questionSet as any).lectures)) {
                      audioTexts = (questionSet as any).lectures
                        .map((lecture: any, index: number) => ({
                          title: `Lecture ${index + 1}${lecture.title ? `: ${lecture.title}` : ''}`,
                          text: lecture.audioText || ''
                        }))
                        .filter((item: any) => item.text);
                    }
                    break;
                  default:
                    if ((questionSet as any).audioText) {
                      audioTexts = [{
                        title: 'Audio Text',
                        text: (questionSet as any).audioText
                      }];
                    }
                }
                
                return audioTexts.length > 0 ? (
                  <div className="mt-4">
                    <span className="text-sm font-medium text-gray-700">Audio Text: </span>
                    <div className="mt-2 space-y-3">
                      {audioTexts.map((item, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-md">
                          <div className="text-sm font-medium text-gray-800 mb-2">{item.title}</div>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{item.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}
            </CardContent>
          </Card>

          {/* Passage */}
          {questionSet.passageText && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Listening Passage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-gray-700 whitespace-pre-wrap">{questionSet.passageText}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Passages (for Part 3) */}
          {questionSet.passages && questionSet.passages.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Listening Passages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {questionSet.passages.map((passage: any, index: number) => (
                    <div key={passage.id || index} className="p-4 border rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Passage {index + 1} - {passage.person || `Person ${index + 1}`}
                      </h4>
                      <p className="text-gray-700">{passage.text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}


          {questionSet.part === 4 && Array.isArray((questionSet as any).lectures) && (questionSet as any).lectures.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Lectures Audio Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {(questionSet as any).lectures.map((lecture: any, idx: number) => {
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

          {/* PREVIEW CHO PART 2 */}
          {questionSet.part === 2 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Listening Passage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{(questionSet as any).passageText || (questionSet as any).passage || 'No passage text available.'}</p>
                </div>
                <div className="mb-4 text-base text-gray-800">Four people are discussing their views on shopping. Complete the sentences. Use each answer only once. You will not need two of the reasons.</div>
                {/* AUDIO PLAYER FOR QUESTIONS SECTION */}
                {((questionSet as any).monologue?.audioUrl || (Array.isArray((questionSet as any).audioFiles) && (questionSet as any).audioFiles[0])) && (
                  <div className="mb-4 flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const audio = document.getElementById('part2-audio') as HTMLAudioElement;
                        if (audio) {
                          if (audio.paused) audio.play();
                          else audio.pause();
                        }
                      }}
                      className="flex items-center gap-1"
                    >
                      <Play className="h-4 w-4" />
                      Play
                    </Button>
                    <audio id="part2-audio" src={(questionSet as any).monologue?.audioUrl || (Array.isArray((questionSet as any).audioFiles) && (questionSet as any).audioFiles[0])} preload="auto" />
                    <span className="text-gray-500 text-sm">Audio for this part</span>
                  </div>
                )}
                <div className="space-y-3">
                  {[...Array(4)].map((_, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <span className="font-medium min-w-[80px]">Person {idx + 1}</span>
                      <select
                        className="flex-1 border rounded px-3 py-2 bg-gray-100 min-h-[40px]"
                        disabled
                      >
                        <option className="text-gray-400">
                          {(() => {
                            const reasons = [
                              'dislikes online shopping',
                              'thinks before purchasing', 
                              'spends a lot of money',
                              'is an impulse buyer',
                              'only shops during certain periods',
                              'prefers to shop alone'
                            ];
                            const reasonLabels = reasons.map((r, i) => String.fromCharCode(65 + i));
                            const questions = (questionSet as any).questions || [];
                            const answer = questions[idx]?.text || questions[idx]?.reason || questions[idx]?.sentence || '';
                            const matchIndex = reasons.findIndex(r => r === answer);
                            return matchIndex >= 0 ? `${reasonLabels[matchIndex]}. ${reasons[matchIndex]}` : '-- No answer --';
                          })()}
                        </option>
                      </select>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* PREVIEW CHO PART 3 */}
          {questionSet.part === 3 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Listening Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 text-base text-gray-800">
                  Listen to two teachers discussing potential modifications to their language school. Read the statements and decide whose opinion matches the best: the man's, the woman's or both.
                </div>
                <div className="mb-3 font-medium text-gray-700">Who expresses which opinion?</div>
                
                {/* AUDIO PLAYER FOR PART 3 */}
                {((questionSet as any).speakers?.[0]?.audioUrl || (Array.isArray((questionSet as any).audioFiles) && (questionSet as any).audioFiles[0])) && (
                  <div className="mb-4 flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const audio = document.getElementById('part3-audio') as HTMLAudioElement;
                        if (audio) {
                          if (audio.paused) audio.play();
                          else audio.pause();
                        }
                      }}
                      className="flex items-center gap-1"
                    >
                      <Play className="h-4 w-4" />
                      Play
                    </Button>
                    <audio id="part3-audio" src={(questionSet as any).speakers?.[0]?.audioUrl || (Array.isArray((questionSet as any).audioFiles) && (questionSet as any).audioFiles[0])} preload="auto" />
                    <span className="text-gray-500 text-sm">Audio for this part</span>
                  </div>
                )}
                
                <div className="space-y-3">
                  {Array.isArray((questionSet as any).questions) && (questionSet as any).questions.map((question: any, index: number) => (
                    <div key={index} className="flex items-center gap-4">
                      <span className="font-medium min-w-[60px]">{index + 1}.{index + 1}</span>
                      <span className="flex-1 text-gray-700">{question.text}</span>
                      <select
                        className="border rounded px-3 py-2 bg-gray-100 min-w-[100px]"
                        value={question.correctPerson || question.answer || ''}
                        disabled
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
          )}

          <div className="flex justify-end mt-6">
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 