
'use client';

import React, { useState } from 'react';
import { Badge, Button, Input } from '@/app/components/ui/basic';
import toast from 'react-hot-toast';

interface ReadingPart1Props {
  previewData: any;
  onEdit?: (updatedData: any) => void;
}

const ReadingPart1: React.FC<ReadingPart1Props> = ({ previewData, onEdit }) => {
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<any>(null);
  const [editingPassage, setEditingPassage] = useState(false);
  const [passageText, setPassageText] = useState('');

  // Extract passage text - support both formats, prioritize passageText (database field)
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
    // Update both formats for compatibility, prioritize database field
    onEdit({ 
      ...previewData, 
      passageText: passageText,
      passage: passageText
    });
    setEditingPassage(false);
    toast.success('Passage updated successfully!');
  };

  const handleCancelEditingPassage = () => {
    setEditingPassage(false);
    setPassageText(currentPassage);
  };

  // Handle case where questions might not exist
  if (!previewData?.questions || previewData.questions.length === 0) {
    return (
      <div className="p-4 border rounded-md bg-yellow-50">
        <p className="text-amber-700">This question set doesn't have properly formatted questions for Reading Part 1.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Passage Section */}
      {currentPassage && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Passage</h3>
            {!editingPassage && onEdit && (
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
                placeholder="Enter passage text..."
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
                      <p className="font-medium text-gray-700">Email Message</p>
                    </div>
                  </div>
                </div>
                <div className="email-body">
                  {currentPassage ? (
                    <div>
                      {(() => {
                        let content = currentPassage;
                        let greeting = '';
                        
                        const greetingMatch = content.match(/^(Hey|Hi|Hello|Dear)\s+[^,]+,/);
                        if (greetingMatch) {
                          greeting = greetingMatch[0];
                          content = content.substring(greeting.length).trim();
                        }
                        
                        let mainContent = content;
                        let signature = '';
                        
                        const signatureMatch = content.match(/(Love|Regards|Best|Sincerely|Yours),\s+[\w\s]+$/i);
                        if (signatureMatch) {
                          const signatureStart = content.lastIndexOf(signatureMatch[0]);
                          mainContent = content.substring(0, signatureStart).trim();
                          signature = content.substring(signatureStart).trim();
                        }
                        
                        return (
                          <>
                            {greeting && <p className="text-sm font-medium mb-3">{greeting}</p>}
                            <p className="text-sm whitespace-pre-wrap leading-relaxed mb-4">{mainContent}</p>
                            {signature && <p className="text-sm whitespace-pre-wrap leading-relaxed mt-2">{signature}</p>}
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
      )}

      {/* Questions Section */}
      <h3 className="text-lg font-semibold mb-2">Questions</h3>
      <div className="space-y-4">
        {previewData.questions?.map((question: any, index: number) => (
          <div key={question.id || index} className="p-4 border rounded-lg">
            {editingQuestionIndex === index ? (
              <div className="space-y-2">
                <Input
                  className="mb-2"
                  value={editingData?.text || ''}
                  onChange={e => handleInputChange('text', e.target.value)}
                  placeholder="Question text"
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
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancelEditing}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-3">
                  <p className="font-semibold">{index + 1}. {question.text}</p>
                  {onEdit && (
                    <Button size="sm" variant="outline" onClick={() => handleStartEditing(index)}>
                      Edit
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  {Object.entries(question.options || {}).map(([key, value]: [string, any]) => (
                    <div
                      key={key}
                      className={`p-2 rounded-md flex items-start gap-2 ${
                        key === question.answer ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                      }`}
                    >
                      <span className="font-medium text-gray-700 w-6">{key}.</span>
                      <p className="text-sm">{value}</p>
                      {key === question.answer && (
                        <Badge variant="outline" className="ml-auto bg-green-100 text-green-800 border-green-200">
                          Correct
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReadingPart1; 