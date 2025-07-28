'use client';

import React, { useState } from 'react';
import { Pencil } from 'lucide-react';
import { Button } from '@/app/components/ui/basic';
import toast from 'react-hot-toast';
import ViewEditQuestionModal from '../../modals/ViewEditQuestionModal';

interface ReadingPart4Props {
  previewData: any;
  onEdit?: (updatedData: any) => void;
}

const ReadingPart4: React.FC<ReadingPart4Props> = ({ previewData, onEdit }) => {
  const [showEditModal, setShowEditModal] = useState(false);

  // Handle case where data might not be in expected format
  if (!previewData || !previewData.questions || previewData.questions.length === 0) {
    return (
      <div className="p-4 border rounded-md bg-yellow-50">
        <p className="text-amber-700">This question set doesn't have properly formatted data for Reading Part 4.</p>
      </div>
    );
  }

  // Extract passage title - support both formats for backward compatibility
  const passageTitle = previewData.passageTitle || previewData.title || '';
  
  // Extract passage text - support both formats, prioritize passageText (database field)
  const passageText = previewData.passageText || previewData.passage || '';
  
  // Group questions by section number
  const sections = previewData.questions.reduce((acc: Record<string, any[]>, question: any) => {
    // Ensure sectionNumber is treated as a string
    const sectionNumber = String(question.sectionNumber || '0');
    if (!acc[sectionNumber]) {
      acc[sectionNumber] = [];
    }
    acc[sectionNumber].push(question);
    return acc;
  }, {});

  // Extract all unique headings from multiple sources for compatibility
  const headings = previewData.headings || 
    (previewData.questions.length > 0 ? previewData.questions[0].options || {} : {});

  // Transform previewData into QuestionSet format for the modal
  const questionSetForModal = {
    id: 'preview-part4',
    title: passageTitle || previewData?.title || 'Reading Part 4 - Heading Match',
    description: 'C1 level heading matching task',
    type: 'reading' as const,
    part: 4,
    level: 'C1' as const,
    source: 'ai-generated' as const,
    questions: previewData.questions,
    passageText: passageText,
    headings: headings,
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
        passageTitle: updatedQuestionSet.title,
        questions: updatedQuestionSet.questions,
        passageText: updatedQuestionSet.passageText,
        passage: updatedQuestionSet.passageText, // Keep both for compatibility
        headings: updatedQuestionSet.headings
      };
      
      onEdit(updatedData);
      toast.success('Question set updated successfully!');
    }
  };


  return (
    <>
      <div className="space-y-6">
        {/* Header with Edit Button */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Reading Part 4 - Heading Match</h2>
            <p className="text-lg font-medium text-gray-800 mt-1">
              {passageTitle || 'No title provided'}
            </p>
          </div>
          {onEdit && (
            <Button 
              onClick={handleOpenEditModal}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <span className="h-4 w-4">✏️</span> Edit Question Set
            </Button>
          )}
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-100 p-3 border-b">
            <h3 className="text-lg font-semibold mb-3">Match the headings to the paragraphs</h3>
            <p className="text-sm text-gray-500 mb-4">There is one heading that you will not use.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
            {/* Left column: Sections */}
            <div className="space-y-4">
              <h4 className="font-semibold">Sections:</h4>
              {Object.entries(sections).map(([sectionNumber, sectionQuestions]) => {
                const question = (sectionQuestions as any[])[0];
                const isExample = question.isExample;
                const sectionText = question.text || '';
                
                // Better handling of answer mapping
                const getAnswerLabel = () => {
                  if (!question.answer) return 'Not Found';
                  
                  const headingEntries = Object.entries(headings);
                  const answerIndex = headingEntries.findIndex(([key]) => key === question.answer);
                  
                  if (answerIndex !== -1) {
                    return String.fromCharCode(65 + answerIndex);
                  }
                  
                  return question.answer;
                };
                
                return (
                  <div key={sectionNumber} className="p-4 border rounded-lg bg-gray-50">
                    <p className="font-semibold text-gray-600 mb-2">
                      Section {sectionNumber}. {isExample ? '(Example)' : ''}
                    </p>
                    <p className="mb-3">{sectionText.replace(`Section ${sectionNumber}: `, '')}</p>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-green-700">Answer:</span>
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        {getAnswerLabel()}. {headings[question.answer]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Right column: Available headings */}
            <div>
              <h4 className="font-semibold mb-3">Available Headings:</h4>
              <div className="p-4 border rounded-lg bg-white">
                <div className="space-y-2">
                  {Object.entries(headings).map(([key, value], index) => (
                    <div key={key} className="p-2 border rounded-md bg-gray-50">
                      <p>{String.fromCharCode(65 + index)}. {String(value)}</p>
                    </div>
                  ))}
                </div>
              </div>
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

export default ReadingPart4; 