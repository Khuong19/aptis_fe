'use client';

import { useState, useEffect } from 'react';
import {
  Button,
  Input,
  Label,
  Textarea,
  Badge,
  toast
} from '@/app/components/ui/basic';
import { Save, Eye, Edit } from 'lucide-react';
import { StepData } from './index';
import ReadingPart1 from '../shared/ReadingPart1';
import ReadingPart2 from '../shared/ReadingPart2';
import ReadingPart3 from '../shared/ReadingPart3';
import ReadingPart4 from '../shared/ReadingPart4';
import ViewEditQuestionModal from '../../modals/ViewEditQuestionModal';
import React from 'react'; // Added missing import for React

interface StepTwoPreviewEditProps {
  stepData: StepData;
  updateStepData: (updates: Partial<StepData>) => void;
  onSave: () => void;
  onCancel?: () => void;
}

export default function StepTwoPreviewEdit({
  stepData,
  updateStepData,
  onSave,
  onCancel,
}: StepTwoPreviewEditProps) {
  const [editedQuestionSet, setEditedQuestionSet] = useState<any>(null);

  const isEditable = true;
  const isReadingPart1 = stepData.part === '1';
  const isReadingPart2 = stepData.part === '2';
  const isReadingPart3 = stepData.part === '3';
  const isReadingPart4 = stepData.part === '4';

  useEffect(() => {
    if (stepData) {
      const questionSetData = {
        id: 'preview-set',
        title: stepData.title,
        description: '',
        type: 'reading',
        part: parseInt(stepData.part),
        level: stepData.level,
        source: 'ai-generated',
        questions: stepData.generatedQuestions || [],
        passages: stepData.passages || [],
        passageText: stepData.passageText || '',
        authorId: 'current-user',
        authorName: 'Current User',
        isPublic: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setEditedQuestionSet(questionSetData);
    }
  }, [stepData]);

  const handleEditData = (updatedData: any) => {
    setEditedQuestionSet(updatedData);
  };

  const handleSave = () => {
    if (editedQuestionSet) {
      let passageTextForSave = editedQuestionSet.passageText;
      let questionsForSave = editedQuestionSet.questions;
      
      // Handle Reading Part 2 special case - convert sentences back to passageText format
      if (isReadingPart2 && editedQuestionSet.questions && editedQuestionSet.questions.length > 0 && editedQuestionSet.questions[0].sentences) {
        passageTextForSave = JSON.stringify(editedQuestionSet.questions[0].sentences);
        // For Part 2, we don't need the questions array in the traditional format
        questionsForSave = editedQuestionSet.questions;
      }
      
      updateStepData({
        title: editedQuestionSet.title,
        passageText: passageTextForSave,
        generatedQuestions: questionsForSave,
        passages: editedQuestionSet.passages,
        finalReview: true,
      });
      onSave();
    }
  };

  if (!editedQuestionSet) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Eye className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Step 2: Preview & Edit Question Set</h2>
            <Badge className="bg-gray-600">Private</Badge>
          </div>
        </div>
        
        <div className="text-sm text-gray-500 flex justify-between mt-2">
          <span>Part {stepData.part} • {editedQuestionSet.questions.length} questions</span>
          <span>By Current User</span>
        </div>

        {/* Content based on part */}
        {isReadingPart1 ? (
          <ReadingPart1InlinePreview 
            questionSet={editedQuestionSet} 
            onEdit={handleEditData}
            isEditable={true}
          />
        ) : isReadingPart2 ? (
          <>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                value={editedQuestionSet.title} 
                onChange={(e) => setEditedQuestionSet({ ...editedQuestionSet, title: e.target.value })} 
              />
            </div>
            <ReadingPart2 previewData={editedQuestionSet} onEdit={handleEditData} />
          </>
        ) : isReadingPart3 ? (
          <ReadingPart3InlinePreview 
            questionSet={editedQuestionSet} 
            onEdit={handleEditData}
            isEditable={true}
          />
        ) : isReadingPart4 ? (
          <>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                value={editedQuestionSet.title} 
                onChange={(e) => setEditedQuestionSet({ ...editedQuestionSet, title: e.target.value })} 
              />
            </div>
            <ReadingPart4 previewData={editedQuestionSet} onEdit={handleEditData} />
          </>
        ) : (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Preview for Part {stepData.part} is not yet implemented in this UI.</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={onCancel || (() => updateStepData({ finalReview: false }))}>Cancel</Button>
          <Button onClick={handleSave} className="bg-[#152C61] hover:bg-[#0f1f45]">Save Question Set</Button>
        </div>
      </div>
    </div>
  );
}

// Inline preview component for Reading Part 1 using ViewEditQuestionModal logic
const ReadingPart1InlinePreview = ({ questionSet, onEdit, isEditable }: any) => {
  const [editingPassage, setEditingPassage] = useState(false);
  // Extract passage from questions[0].passage since backend stores it there
  const [passageText, setPassageText] = useState(questionSet?.questions?.[0]?.passage || questionSet?.passageText || '');

  const handleStartEditingPassage = () => {
    if (!isEditable) return;
    setEditingPassage(true);
  };

  const handleSavePassage = () => {
    if (!questionSet) return;
    // Update both passageText and questions[0].passage to maintain compatibility
    const updatedQuestions = [...(questionSet.questions || [])];
    if (updatedQuestions[0]) {
      updatedQuestions[0] = { ...updatedQuestions[0], passage: passageText };
    }
    const updatedQuestionSet = { 
      ...questionSet, 
      passageText,
      questions: updatedQuestions
    };
    onEdit(updatedQuestionSet);
    setEditingPassage(false);
  };

  const handleCancelEditingPassage = () => {
    setEditingPassage(false);
    setPassageText(questionSet?.questions?.[0]?.passage || questionSet?.passageText || '');
  };

  // Update passageText when questionSet changes
  React.useEffect(() => {
    setPassageText(questionSet?.questions?.[0]?.passage || questionSet?.passageText || '');
  }, [questionSet?.questions, questionSet?.passageText]);

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input 
          id="title" 
          value={questionSet?.title || ''} 
          onChange={(e) => onEdit({ ...questionSet, title: e.target.value })}
          disabled={!isEditable}
        />
      </div>

      <div className="space-y-4">
        {/* Passage Section - Email Style */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Passage</h3>
            {!editingPassage && isEditable && (
              <Button size="sm" variant="outline" onClick={handleStartEditingPassage}>
                Edit Passage
              </Button>
            )}
          </div>
          {editingPassage ? (
            <div className="p-4 border rounded-lg bg-gray-50">
              <textarea
                className="w-full min-h-[200px] p-2 border rounded-md text-sm"
                value={passageText}
                onChange={(e) => setPassageText(e.target.value)}
              />
              <div className="flex justify-end gap-2 mt-3">
                <Button size="sm" variant="outline" onClick={handleCancelEditingPassage}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSavePassage}>
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-4 border rounded-lg bg-gray-50">
              <div className="email-container bg-white border border-gray-200 rounded-md p-5 shadow-sm">
                <div className="email-header border-b pb-3 mb-3">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium text-gray-700">Choose the word that fits in the gap. the first one is done for you.</p>
                    </div>
                  </div>
                </div>
                <div className="email-body">
                  {passageText ? (
                    <div>
                      {(() => {
                        // Email structure: greeting, main content, signature
                        const greetingMatch = passageText.match(/^(Hey|Hi|Hello|Dear|Hi)\s+[^,]+,/);
                        let greeting = '';
                        let content = passageText;
                        if (greetingMatch) {
                          greeting = greetingMatch[0];
                          content = content.substring(greeting.length).trim();
                        }
                        let mainContent = content;
                        let signature = '';
                        // Signature: e.g., 'Love,\nHelen' or similar
                        const signatureMatch = content.match(/(Love|Regards|Best|Sincerely|Yours|Thanks),\s*[\w\s]+$/i);
                        if (signatureMatch) {
                          const signatureStart = content.lastIndexOf(signatureMatch[0]);
                          mainContent = content.substring(0, signatureStart).trim();
                          signature = content.substring(signatureStart).trim();
                        }
                        // Render mainContent with dropdowns
                        const gapRegex = /\[(\d+)\]/g;
                        let lastIndex = 0;
                        let match;
                        const elements: React.ReactNode[] = [];
                        let gapCount = 0;
                        while ((match = gapRegex.exec(mainContent)) !== null) {
                          const start = match.index;
                          const end = gapRegex.lastIndex;
                          elements.push(
                            <span key={`text-${gapCount}`}>{mainContent.slice(lastIndex, start)}</span>
                          );
                          const gapIdx = parseInt(match[1], 10) - 1;
                          const question = questionSet.questions[gapIdx];
                          elements.push(
                            <select
                              key={`gap-${gapCount}`}
                              className="mx-1 px-2 py-1 border border-yellow-300 rounded bg-yellow-100 text-sm font-medium min-w-[80px]"
                              value={question?.answer || ''}
                              onChange={(e) => {
                                if (!isEditable) return;
                                const updatedQuestions = [...(questionSet.questions || [])];
                                if (updatedQuestions[gapIdx]) {
                                  updatedQuestions[gapIdx] = { 
                                    ...updatedQuestions[gapIdx], 
                                    answer: e.target.value 
                                  };
                                  onEdit({ ...questionSet, questions: updatedQuestions });
                                }
                              }}
                              disabled={gapIdx === 0 || !isEditable} // First one is done for you or not editable
                            >
                              <option value="" disabled className="text-gray-400">Select...</option>
                              {question && Object.entries(question.options || {}).map(([key, value]) => (
                                <option key={key} value={key} className="text-gray-900">
                                  {String(value)}
                                </option>
                              ))}
                            </select>
                          );
                          lastIndex = end;
                          gapCount++;
                        }
                        if (lastIndex < mainContent.length) {
                          elements.push(
                            <span key="text-final">{mainContent.slice(lastIndex)}</span>
                          );
                        }
                        return (
                          <>
                            {greeting && <p className="mb-2 font-semibold">{greeting}</p>}
                            <p className="text-sm whitespace-pre-wrap leading-relaxed mb-4">{elements}</p>
                            {signature && (
                              <div className="mt-4">
                                {signature.split(/\n|\r/).map((line, idx) => (
                                  <p key={idx} className={idx === 0 ? 'font-semibold' : ''}>{line}</p>
                                ))}
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No passage available</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Inline preview component for Reading Part 3 using ViewEditQuestionModal logic
const ReadingPart3InlinePreview = ({ questionSet, onEdit, isEditable }: any) => {
  // Part 3 specific states  
  const [editingP3Passage, setEditingP3Passage] = useState<number | null>(null);
  const [editingP3Question, setEditingP3Question] = useState<number | null>(null);
  const [editingP3PassageText, setEditingP3PassageText] = useState('');
  const [editingP3QuestionData, setEditingP3QuestionData] = useState<any>(null);

  // Check if data is available
  const passages = questionSet?.passages || [];
  const questions = questionSet?.questions || [];
  const hasValidData = passages.length > 0 || questions.length > 0;

  // Part 3 handlers
  const handleP3StartEditingPassage = (index: number) => {
    if (!isEditable) return;
    const passage = passages[index];
    setEditingP3Passage(index);
    setEditingP3PassageText(passage.text || passage.content || '');
  };

  const handleP3SavePassage = () => {
    if (editingP3Passage !== null && questionSet) {
      const updatedPassages = [...(questionSet.passages || [])];
      updatedPassages[editingP3Passage] = {
        ...updatedPassages[editingP3Passage],
        text: editingP3PassageText,
        content: editingP3PassageText
      };
      
      const updatedQuestionSet = {
        ...questionSet,
        passages: updatedPassages
      };
      
      onEdit(updatedQuestionSet);
      setEditingP3Passage(null);
      toast({ title: "Success", description: "Passage updated successfully!" });
    }
  };

  const handleP3StartEditingQuestion = (index: number) => {
    if (!isEditable) return;
    const question = questions[index];
    setEditingP3Question(index);
    setEditingP3QuestionData({
      ...question,
      text: question.text || '',
      answer: question.answer || question.correctPerson || ''
    });
  };

  const handleP3SaveQuestion = () => {
    if (editingP3Question !== null && editingP3QuestionData && questionSet) {
      const updatedQuestions = [...(questionSet.questions || [])];
      updatedQuestions[editingP3Question] = {
        ...updatedQuestions[editingP3Question],
        ...editingP3QuestionData,
        correctPerson: editingP3QuestionData.answer
      };
      
      const updatedQuestionSet = {
        ...questionSet,
        questions: updatedQuestions
      };
      
      onEdit(updatedQuestionSet);
      setEditingP3Question(null);
      setEditingP3QuestionData(null);
      toast({ title: "Success", description: "Question updated successfully!" });
    }
  };

  if (!hasValidData) {
    return (
      <div className="space-y-6">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input 
            id="title" 
            value={questionSet?.title || ''} 
            onChange={(e) => onEdit({ ...questionSet, title: e.target.value })}
            disabled={!isEditable}
          />
        </div>
        <div className="p-4 bg-yellow-50 rounded-lg">
          <p className="text-amber-700">This question set doesn't have properly formatted data for Reading Part {questionSet?.part}.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input 
          id="title" 
          value={questionSet?.title || ''} 
          onChange={(e) => onEdit({ ...questionSet, title: e.target.value })}
          disabled={!isEditable}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Passages</h3>
          <div className="space-y-4">
            {passages.map((passage: any, index: number) => (
              <div key={passage.id || index} className="p-4 border rounded-lg bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold text-gray-600">Person {passage.person || passage.id || (index + 1)}</p>
                  {isEditable && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleP3StartEditingPassage(index)}
                      className="h-8 px-2"
                    >
                      ✏️
                    </Button>
                  )}
                </div>
                
                {editingP3Passage === index ? (
                  <div className="space-y-3">
                    <textarea
                      rows={4}
                      value={editingP3PassageText}
                      onChange={(e) => setEditingP3PassageText(e.target.value)}
                      className="w-full p-2 text-sm border rounded"
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingP3Passage(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleP3SavePassage}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{passage.text || passage.content}</p>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-3">Questions</h3>
          <div className="space-y-4">
            {questions.map((q: any, qIndex: number) => {
              const correctPerson = q.correctPerson || q.answer;
              return (
                <div key={q.id || qIndex} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <p className="font-semibold mb-3">{qIndex + 1}. {q.text}</p>
                    {isEditable && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleP3StartEditingQuestion(qIndex)}
                        className="h-8 px-2 -mt-1"
                      >
                        ✏️
                      </Button>
                    )}
                  </div>
                  
                  {editingP3Question === qIndex ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Question Text</label>
                        <Input
                          value={editingP3QuestionData?.text || ''}
                          onChange={(e) => setEditingP3QuestionData({
                            ...editingP3QuestionData,
                            text: e.target.value
                          })}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Correct Person</label>
                        <select
                          value={editingP3QuestionData?.answer || ''}
                          onChange={(e) => setEditingP3QuestionData({
                            ...editingP3QuestionData,
                            answer: e.target.value
                          })}
                          className="w-full p-2 border rounded"
                        >
                          {passages.map((p: any, i: number) => (
                            <option key={i} value={p.person || p.id || (i + 1)}>
                              Person {p.person || p.id || (i + 1)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingP3Question(null);
                            setEditingP3QuestionData(null);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          onClick={handleP3SaveQuestion}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <span className="font-semibold text-green-700">Answer: </span>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        Person {correctPerson}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
