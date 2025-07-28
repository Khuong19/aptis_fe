'use client';

import { useState, useEffect } from 'react';
import { QuestionSet } from '@/app/types/question-bank';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/basic';
import { X, Headphones, Save, Edit2 } from 'lucide-react';
import { showToast } from '@/app/components/ui/ToastContainer';
import { QuestionOption } from '@/app/types/question-bank';

interface OrderingSentence {
  id: string;
  text: string;
  order: number;
}

interface ViewEditListeningQuestionModalProps {
  isOpen: boolean;
  questionSet: QuestionSet;
  isEditable: boolean;
  onClose: () => void;
  onUpdateQuestionSet: (updatedSet: QuestionSet) => void;
}

export default function ViewEditListeningQuestionModal({
  isOpen,
  questionSet,
  isEditable,
  onClose,
  onUpdateQuestionSet
}: ViewEditListeningQuestionModalProps) {
  const [editedQuestionSet, setEditedQuestionSet] = useState<QuestionSet | null>(null);
  const [passageText, setPassageText] = useState('');
  const [editingP4TitleText, setEditingP4TitleText] = useState('');
  const [sentences, setSentences] = useState<OrderingSentence[]>([]);

  useEffect(() => {
    if (questionSet) {
      const deepClone = JSON.parse(JSON.stringify(questionSet));
      setEditedQuestionSet(deepClone);
      setPassageText(deepClone.passageText || '');
      setEditingP4TitleText(deepClone.title || '');

      const isListeningPart2 = deepClone.type === 'listening' && deepClone.part === '2';
      if (isListeningPart2) {
        try {
          const parsedSentences: OrderingSentence[] = JSON.parse(deepClone.passageText || '[]');
          setSentences(parsedSentences);
        } catch (error) {
          console.error("Failed to parse sentences from passageText", error);
          setSentences([]);
        }
      } else {
        setSentences([]);
      }
    }
  }, [questionSet]);

  if (!questionSet || !editedQuestionSet) {
    return null;
  }

  const isListeningPart1 = editedQuestionSet.type === 'listening' && editedQuestionSet.part === 1;
  const isListeningPart2 = editedQuestionSet.type === 'listening' && editedQuestionSet.part === 2;
  const isListeningPart3 = editedQuestionSet.type === 'listening' && editedQuestionSet.part === 3;
  const isListeningPart4 = editedQuestionSet.type === 'listening' && editedQuestionSet.part === 4;

  const validateForm = () => {
    if (!editedQuestionSet.title?.trim()) return 'Title is required';
    
    if (isListeningPart4) {
      if (!editedQuestionSet.passageText?.trim()) return 'Passage text is required';
      if (!editedQuestionSet.questions || editedQuestionSet.questions.length === 0) return 'At least one section is required';
      if (editedQuestionSet.questions.some(q => !q.text?.trim())) return 'All sections must have text';
      if (editedQuestionSet.questions.some(q => !q.answer)) return 'Each section must have a matched heading';
      // Check if headings are available
      const headings = editedQuestionSet.headings || (editedQuestionSet.questions.length > 0 ? editedQuestionSet.questions[0].options : null);
      if (!headings) return 'Headings are required for Part 4';
    } else if (editedQuestionSet.part === 1 && editedQuestionSet.type === 'listening') {
      if (!editedQuestionSet.passageText?.trim()) return 'Passage text is required';
      for (let i = 0; i < editedQuestionSet.questions.length; i++) {
        if (!editedQuestionSet.passageText.includes(`[q${editedQuestionSet.id}-${i}]`)) {
          return `Passage must include placeholder for Gap ${i + 1}`;
        }
      }
    }
    
    // Validate questions
    if (editedQuestionSet.questions && editedQuestionSet.questions.length > 0) {
      for (let qIndex = 0; qIndex < editedQuestionSet.questions.length; qIndex++) {
        const q = editedQuestionSet.questions[qIndex];
        if (!q.text.trim()) return `Question ${qIndex + 1} text is required`;
        
        if (Array.isArray(q.options)) {
          if (q.options.some((opt: QuestionOption) => !opt.text.trim())) return `All options in Question ${qIndex + 1} are required`;
          if (!q.options.some((opt: QuestionOption) => opt.isCorrect)) return `A correct answer for Question ${qIndex + 1} is required`;
        } else {
          // Handle object-style options (A, B, C, D)
          const optionValues = Object.values(q.options);
          if (optionValues.some((text: string) => !text.trim())) return `All options in Question ${qIndex + 1} are required`;
          if (!q.answer) return `A correct answer for Question ${qIndex + 1} is required`;
        }
      }
    }
    return null;
  };

  const handleSave = () => {
    const error = validateForm();
    if (error) {
      showToast(error, 'error');
      return;
    }

    if (editedQuestionSet) {
      const updatedSet = { ...editedQuestionSet };

      if (isListeningPart1) {
        updatedSet.passageText = passageText;
      } else if (isListeningPart2) {
        updatedSet.passageText = JSON.stringify(sentences);
        updatedSet.questions = [];
      } else if (isListeningPart3) {
        // Passages and questions are already in the correct state
        updatedSet.passageText = ''; // Clear this as it's not used for Part 3
      } else if (isListeningPart4) {
        // For Part 4, passageText and questions structure are maintained as-is
        // No special transformation needed
      }

      onUpdateQuestionSet({ ...updatedSet, updatedAt: new Date().toISOString() });
      showToast("Listening question set updated successfully", 'success');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Headphones className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold">
                {isEditable ? 'Edit' : 'View'} Listening Question Set
              </h2>
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

          {/* Basic Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editedQuestionSet.title || ''}
                  onChange={(e) => setEditedQuestionSet(prev => prev ? { ...prev, title: e.target.value } : null)}
                  disabled={!isEditable}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="part">Part</Label>
                  <Select
                    value={editedQuestionSet.part?.toString() || '1'}
                    onValueChange={(value) => setEditedQuestionSet(prev => prev ? { ...prev, part: parseInt(value) } : null)}
                    disabled={!isEditable}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Part 1</SelectItem>
                      <SelectItem value="2">Part 2</SelectItem>
                      <SelectItem value="3">Part 3</SelectItem>
                      <SelectItem value="4">Part 4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="level">Level</Label>
                  <Select
                    value={editedQuestionSet.level || 'B1'}
                    onValueChange={(value) => setEditedQuestionSet(prev => prev ? { ...prev, level: value as 'A2' | 'A2+' | 'B1' | 'B2' | 'C1' | 'mixed' } : null)}
                    disabled={!isEditable}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A2">A2</SelectItem>
                      <SelectItem value="A2+">A2+</SelectItem>
                      <SelectItem value="B1">B1</SelectItem>
                      <SelectItem value="B2">B2</SelectItem>
                      <SelectItem value="C1">C1</SelectItem>
                      <SelectItem value="mixed">Mixed (A2+/B1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Audio Text - Different locations based on part */}
              <div>
                <Label>Audio Text</Label>
                <div className="space-y-4">
                  {(() => {
                    switch (editedQuestionSet.part) {
                      case 1:
                        const conversations = (editedQuestionSet as any).conversations || [];
                        return conversations.map((conv: any, index: number) => (
                          <div key={index} className="space-y-2">
                            <Label htmlFor={`conversation-${index}`}>Conversation {index + 1}</Label>
                            <textarea
                              id={`conversation-${index}`}
                              value={conv.audioText || ''}
                              onChange={(e) => {
                                setEditedQuestionSet(prev => {
                                  if (!prev) return null;
                                  const updated = { ...prev };
                                  if (!updated.conversations) updated.conversations = [];
                                  updated.conversations[index] = { ...conv, audioText: e.target.value };
                                  return updated;
                                });
                              }}
                              disabled={!isEditable}
                              className="w-full h-24 p-3 border rounded-md resize-none"
                              placeholder={`Enter conversation ${index + 1} audio text...`}
                            />
                          </div>
                        ));
                      case 2:
                        return (
                          <div className="space-y-2">
                            <Label htmlFor="monologue">Monologue</Label>
                            <textarea
                              id="monologue"
                              value={(editedQuestionSet as any).monologue?.audioText || ''}
                              onChange={(e) => {
                                setEditedQuestionSet(prev => {
                                  if (!prev) return null;
                                  const updated = { ...prev };
                                  if (!updated.monologue) updated.monologue = {};
                                  updated.monologue.audioText = e.target.value;
                                  return updated;
                                });
                              }}
                              disabled={!isEditable}
                              className="w-full h-32 p-3 border rounded-md resize-none"
                              placeholder="Enter monologue audio text..."
                            />
                          </div>
                        );
                      case 3:
                        const discussions = (editedQuestionSet as any).discussion || [];
                        return discussions.map((disc: any, index: number) => (
                          <div key={index} className="space-y-2">
                            <Label htmlFor={`discussion-${index}`}>Discussion {index + 1}</Label>
                            <textarea
                              id={`discussion-${index}`}
                              value={disc.text || ''}
                              onChange={(e) => {
                                setEditedQuestionSet(prev => {
                                  if (!prev) return null;
                                  const updated = { ...prev };
                                  if (!updated.discussion) updated.discussion = [];
                                  updated.discussion[index] = { ...disc, text: e.target.value };
                                  return updated;
                                });
                              }}
                              disabled={!isEditable}
                              className="w-full h-24 p-3 border rounded-md resize-none"
                              placeholder={`Enter discussion ${index + 1} text...`}
                            />
                          </div>
                        ));
                      case 4:
                        const lectures = (editedQuestionSet as any).lectures || [];
                        return lectures.map((lecture: any, index: number) => (
                          <div key={index} className="space-y-2">
                            <Label htmlFor={`lecture-${index}`}>
                              Lecture {index + 1}{lecture.title ? `: ${lecture.title}` : ''}
                            </Label>
                            <textarea
                              id={`lecture-${index}`}
                              value={lecture.audioText || ''}
                              onChange={(e) => {
                                setEditedQuestionSet(prev => {
                                  if (!prev) return null;
                                  const updated = { ...prev };
                                  if (!updated.lectures) updated.lectures = [];
                                  updated.lectures[index] = { ...lecture, audioText: e.target.value };
                                  return updated;
                                });
                              }}
                              disabled={!isEditable}
                              className="w-full h-24 p-3 border rounded-md resize-none"
                              placeholder={`Enter lecture ${index + 1} audio text...`}
                            />
                          </div>
                        ));
                      default:
                        return (
                          <div className="space-y-2">
                            <Label htmlFor="audioText">Audio Text</Label>
                            <textarea
                              id="audioText"
                              value={(editedQuestionSet as any).audioText || ''}
                              onChange={(e) => {
                                setEditedQuestionSet(prev => {
                                  if (!prev) return null;
                                  return { ...prev, audioText: e.target.value };
                                });
                              }}
                              disabled={!isEditable}
                              className="w-full h-32 p-3 border rounded-md resize-none"
                              placeholder="Enter the audio text transcript..."
                            />
                          </div>
                        );
                    }
                  })()}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Passage Text */}
          {(isListeningPart1 || isListeningPart4) && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Listening Passage</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={passageText}
                  onChange={(e) => setPassageText(e.target.value)}
                  disabled={!isEditable}
                  className="w-full h-32 p-3 border rounded-md resize-none"
                  placeholder="Enter the listening passage text..."
                />
              </CardContent>
            </Card>
          )}

          {/* Questions */}
          {editedQuestionSet.questions && editedQuestionSet.questions.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {editedQuestionSet.questions.map((question: any, index: number) => (
                    <div key={question.id || index} className="p-4 border rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Question {index + 1}
                      </h4>
                      
                      <div className="space-y-2">
                        <div>
                          <Label>Question Text</Label>
                          <Input
                            value={question.text || ''}
                            onChange={(e) => {
                              const updatedQuestions = [...editedQuestionSet.questions];
                              updatedQuestions[index] = { ...question, text: e.target.value };
                              setEditedQuestionSet(prev => prev ? { ...prev, questions: updatedQuestions } : null);
                            }}
                            disabled={!isEditable}
                          />
                        </div>
                        
                        {/* Options for multiple choice questions */}
                        {question.options && typeof question.options === 'object' && !Array.isArray(question.options) && (
                          <div className="space-y-2">
                            <Label>Options</Label>
                            {Object.entries(question.options).map(([key, value]: [string, any]) => (
                              <div key={key} className="flex items-center gap-2">
                                <span className="font-medium text-gray-700 w-6">{key}.</span>
                                <Input
                                  value={value || ''}
                                  onChange={(e) => {
                                    const updatedQuestions = [...editedQuestionSet.questions];
                                    updatedQuestions[index] = {
                                      ...question,
                                      options: { ...question.options, [key]: e.target.value }
                                    };
                                    setEditedQuestionSet(prev => prev ? { ...prev, questions: updatedQuestions } : null);
                                  }}
                                  disabled={!isEditable}
                                  className="flex-1"
                                />
                                <input
                                  type="radio"
                                  checked={question.answer === key}
                                  onChange={() => {
                                    const updatedQuestions = [...editedQuestionSet.questions];
                                    updatedQuestions[index] = { ...question, answer: key };
                                    setEditedQuestionSet(prev => prev ? { ...prev, questions: updatedQuestions } : null);
                                  }}
                                  disabled={!isEditable}
                                  name={`answer-${index}`}
                                />
                                <span className="text-xs">Correct</span>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Other question properties */}
                        {question.sentence && (
                          <div>
                            <Label>Sentence</Label>
                            <Input
                              value={question.sentence || ''}
                              onChange={(e) => {
                                const updatedQuestions = [...editedQuestionSet.questions];
                                updatedQuestions[index] = { ...question, sentence: e.target.value };
                                setEditedQuestionSet(prev => prev ? { ...prev, questions: updatedQuestions } : null);
                              }}
                              disabled={!isEditable}
                            />
                          </div>
                        )}
                        
                        {question.position && (
                          <div>
                            <Label>Position</Label>
                            <Input
                              type="number"
                              value={question.position || ''}
                              onChange={(e) => {
                                const updatedQuestions = [...editedQuestionSet.questions];
                                updatedQuestions[index] = { ...question, position: parseInt(e.target.value) };
                                setEditedQuestionSet(prev => prev ? { ...prev, questions: updatedQuestions } : null);
                              }}
                              disabled={!isEditable}
                            />
                          </div>
                        )}
                        
                        {question.correctPerson && (
                          <div>
                            <Label>Correct Person</Label>
                            <Input
                              value={question.correctPerson || ''}
                              onChange={(e) => {
                                const updatedQuestions = [...editedQuestionSet.questions];
                                updatedQuestions[index] = { ...question, correctPerson: e.target.value };
                                setEditedQuestionSet(prev => prev ? { ...prev, questions: updatedQuestions } : null);
                              }}
                              disabled={!isEditable}
                            />
                          </div>
                        )}
                        
                        {question.paragraph && (
                          <div>
                            <Label>Paragraph</Label>
                            <Input
                              value={question.paragraph || ''}
                              onChange={(e) => {
                                const updatedQuestions = [...editedQuestionSet.questions];
                                updatedQuestions[index] = { ...question, paragraph: e.target.value };
                                setEditedQuestionSet(prev => prev ? { ...prev, questions: updatedQuestions } : null);
                              }}
                              disabled={!isEditable}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
            {isEditable && (
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 