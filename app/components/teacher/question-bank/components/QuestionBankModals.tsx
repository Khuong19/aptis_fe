'use client';

import { QuestionSet, Comment } from '@/app/types/question-bank';
import NewQuestionSetModal from '../modals/NewQuestionSetModal';
import ViewQuestionSetModal from '../modals/ViewQuestionSetModal';
import ViewEditQuestionModal from '../modals/ViewEditQuestionModal';
import CommentModal from '../modals/CommentModal';

interface QuestionBankModalsProps {
  // New Question Set Modal
  isNewModalOpen: boolean;
  setIsNewModalOpen: (isOpen: boolean) => void;
  handleCreateQuestionSet: (newSet: QuestionSet) => void;
  currentUserId: string;
  currentUserName: string;
  
  // View Question Set Modal
  isViewModalOpen: boolean;
  setIsViewModalOpen: (isOpen: boolean) => void;
  viewingQuestionSet: QuestionSet | null;
  
  // View/Edit Question Set Modal
  isViewEditModalOpen: boolean;
  setIsViewEditModalOpen: (isOpen: boolean) => void;
  currentQuestionSet: QuestionSet | null;
  editMode: boolean;
  setEditMode: (isEdit: boolean) => void;
  handleSaveQuestionSet: (updatedSet: QuestionSet) => void;
  
  // Comment Modal
  isCommentModalOpen: boolean;
  setIsCommentModalOpen: (isOpen: boolean) => void;
  selectedQuestionSet: QuestionSet | null;
  comments: Comment[];
  handleAddCommentFromModal: (questionSetId: string, text: string) => void;
}

const QuestionBankModals = ({
  // New Question Set Modal
  isNewModalOpen,
  setIsNewModalOpen,
  handleCreateQuestionSet,
  currentUserId,
  currentUserName,
  
  // View Question Set Modal
  isViewModalOpen,
  setIsViewModalOpen,
  viewingQuestionSet,
  
  // View/Edit Question Set Modal
  isViewEditModalOpen,
  setIsViewEditModalOpen,
  currentQuestionSet,
  editMode,
  setEditMode,
  handleSaveQuestionSet,
  
  // Comment Modal
  isCommentModalOpen,
  setIsCommentModalOpen,
  selectedQuestionSet,
  comments,
  handleAddCommentFromModal,
}: QuestionBankModalsProps) => {
  return (
    <>
      {/* New Question Set Modal */}
      {isNewModalOpen && (
        <NewQuestionSetModal 
          isOpen={isNewModalOpen}
          onClose={() => setIsNewModalOpen(false)}
          onAddQuestionSet={handleCreateQuestionSet}
          currentUserId={currentUserId}
          currentUserName={currentUserName}
        />
      )}
      
      {/* View Question Set Modal */}
      {isViewModalOpen && viewingQuestionSet && (
        <ViewQuestionSetModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          questionSet={viewingQuestionSet}
        />
      )}
      
      {/* View/Edit Question Set Modal */}
      {isViewEditModalOpen && currentQuestionSet && (
        <ViewEditQuestionModal
          isOpen={isViewEditModalOpen}
          onClose={() => {
            setIsViewEditModalOpen(false);
            setEditMode(false);
          }}
          questionSet={currentQuestionSet}
          isEditable={editMode}
          onUpdateQuestionSet={handleSaveQuestionSet}
        />
      )}
      
      {/* Comment Modal */}
      {isCommentModalOpen && selectedQuestionSet && (
        <CommentModal
          isOpen={isCommentModalOpen}
          onClose={() => setIsCommentModalOpen(false)}
          questionSet={selectedQuestionSet}
          comments={comments.filter(c => c.questionSetId === selectedQuestionSet.id)}
          currentUserName={currentUserName}
          onAddComment={handleAddCommentFromModal}
        />
      )}
    </>
  );
};

export default QuestionBankModals;
