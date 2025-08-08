'use client';

import { QuestionSet } from '@/app/types/question-bank';
import QuestionSetCreationTabs from '../create-question-set/QuestionSetCreationTabs';

interface NewQuestionSetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddQuestionSet: (questionSet: QuestionSet) => void;
  currentUserId: string;
  currentUserName: string;
} 

export default function NewQuestionSetModal({
  isOpen,
  onClose,
  onAddQuestionSet,
  currentUserId,
  currentUserName,
}: NewQuestionSetModalProps): JSX.Element {

  const handleSuccess = (newQuestionSets: QuestionSet[]) => {
    // Add each question set individually
    newQuestionSets.forEach(questionSet => {
      // Ensure author information is added
      const enrichedQuestionSet = {
        ...questionSet,
        authorId: currentUserId,
        authorName: currentUserName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      onAddQuestionSet(enrichedQuestionSet);
    });
    onClose();
  };

  if (!isOpen) return <></>;
  
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50" onClick={() => onClose()}>
      <div className="bg-white rounded-lg max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4">
          <h2 className="text-xl font-bold">Create New Question Set</h2>
        </div>
        
        <div className="mt-4">
          <QuestionSetCreationTabs onSuccess={handleSuccess} />
        </div>
        

      </div>
    </div>
  );
}

