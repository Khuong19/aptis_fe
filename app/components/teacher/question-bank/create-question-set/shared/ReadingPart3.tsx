'use client';

import React, { useState } from 'react';
import { Badge, Button, Input } from '@/app/components/ui/basic';
import toast from 'react-hot-toast';
import ViewEditQuestionModal from '../../modals/ViewEditQuestionModal';

interface ReadingPart3Props {
  previewData: any;
  onEdit?: (updatedData: any) => void;
}

const ReadingPart3: React.FC<ReadingPart3Props> = ({ previewData, onEdit }) => {
  const [showEditModal, setShowEditModal] = useState(false);

  // Handle case where data might not be in expected format
  const passages = previewData?.passages || [];
  const questions = previewData?.questions || [];

  // If no passages exist but questions do, create default passages structure
  const hasValidData = passages.length > 0 || questions.length > 0;

  // Transform previewData into QuestionSet format for the modal
  const questionSetForModal = {
    id: 'preview-part3',
    title: previewData?.title || 'Reading Part 3 - Matching',
    description: 'B2 level matching task',
    type: 'reading' as const,
    part: 3,
    level: 'B2' as const,
    source: 'ai-generated' as const,
    questions: questions,
    passages: passages,
    authorId: 'current-user',
    authorName: 'Current User',
    isPublic: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const handleOpenEditModal = () => {
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleUpdateQuestionSet = (updatedQuestionSet: any) => {
    if (onEdit) {
      // Transform back to the expected format
      const updatedData = {
        ...previewData,
        title: updatedQuestionSet.title,
        questions: updatedQuestionSet.questions,
        passages: updatedQuestionSet.passages
      };
      
      onEdit(updatedData);
      toast.success('Question set updated successfully!');
    }
  };
  
  if (!hasValidData) {
    return (
      <div className="p-4 border rounded-md bg-yellow-50">
        <p className="text-amber-700">This question set doesn't have properly formatted data for Reading Part 3.</p>
      </div>
    );
  }


  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Reading Part 3 - Matching</h3>
          {onEdit && (
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={handleOpenEditModal}
              className="flex items-center gap-1"
            >
              <span className="h-4 w-4">✏️</span> Edit Question Set
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-md font-semibold mb-3">Passages</h4>
            <div className="space-y-4">
              {passages.map((passage: any, index: number) => (
                <div key={passage.id || index} className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold text-gray-600">
                      Person {passage.person || passage.id || (index + 1)}
                    </p>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{passage.text || passage.content}</p>
                </div>
              ))}
              
              {passages.length === 0 && (
                <div className="p-4 border rounded-lg bg-yellow-50">
                  <p className="text-amber-700 text-sm">No passages available.</p>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-3">Questions</h4>
            <div className="space-y-4">
              {questions.map((q: any, qIndex: number) => {
                const correctPerson = q.correctPerson || q.answer;
                return (
                  <div key={q.id || qIndex} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <p className="font-semibold mb-3">{qIndex + 1}. {q.text}</p>
                    </div>
                    <div className="mt-2">
                      <span className="font-semibold text-green-700">Answer: </span>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        Person {correctPerson}
                      </span>
                    </div>
                  </div>
                );
              })}
              
              {questions.length === 0 && (
                <div className="p-4 border rounded-lg bg-yellow-50">
                  <p className="text-amber-700 text-sm">No questions available.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <ViewEditQuestionModal
        isOpen={showEditModal}
        questionSet={questionSetForModal}
        isEditable={true}
        onClose={handleCloseEditModal}
        onUpdateQuestionSet={handleUpdateQuestionSet}
      />
    </>
  );
};

export default ReadingPart3; 