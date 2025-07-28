'use client';

import { QuestionSet, Comment } from '@/app/types/question-bank';
import ListeningQuestionSetCreationTabs from '../create-question-set/ListeningQuestionSetCreationTabs';
import ViewListeningQuestionModal from '../modals/ViewListeningQuestionModal';
import ViewEditListeningQuestionModal from '../modals/ViewEditListeningQuestionModal';
import CommentModal from '../modals/CommentModal';

interface ListeningQuestionBankModalsProps {
  // New Question Set Modal
  isNewModalOpen: boolean;
  setIsNewModalOpen: (open: boolean) => void;
  handleCreateQuestionSet: (newSet: QuestionSet) => void;
  currentUserId: string;
  currentUserName: string;
  
  // View Question Set Modal
  isViewModalOpen: boolean;
  setIsViewModalOpen: (open: boolean) => void;
  viewingQuestionSet: QuestionSet | null;
  
  // View/Edit Question Set Modal
  isViewEditModalOpen: boolean;
  setIsViewEditModalOpen: (open: boolean) => void;
  currentQuestionSet: QuestionSet | null;
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  handleSaveQuestionSet: (updatedSet: QuestionSet) => void;
  
  // Comment Modal
  isCommentModalOpen: boolean;
  setIsCommentModalOpen: (open: boolean) => void;
  selectedQuestionSet: QuestionSet | null;
  comments: Comment[];
  handleAddCommentFromModal: (questionSetId: string, text: string) => void;
}

export default function ListeningQuestionBankModals({
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
}: ListeningQuestionBankModalsProps) {
  return (
    <>
      {/* New Question Set Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Create New Listening Question Set</h2>
                <button
                  onClick={() => setIsNewModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <ListeningQuestionSetCreationTabs
                onSuccess={(newSets) => {
                  newSets.forEach(set => handleCreateQuestionSet(set));
                  setIsNewModalOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* View Question Set Modal */}
      {isViewModalOpen && viewingQuestionSet && (
        <ViewListeningQuestionModal
          isOpen={isViewModalOpen}
          questionSet={viewingQuestionSet}
          onClose={() => setIsViewModalOpen(false)}
        />
      )}

      {/* View/Edit Question Set Modal */}
      {isViewEditModalOpen && currentQuestionSet && (
        <ViewEditListeningQuestionModal
          isOpen={isViewEditModalOpen}
          questionSet={currentQuestionSet}
          isEditable={editMode}
          onClose={() => {
            setIsViewEditModalOpen(false);
            setEditMode(false);
          }}
          onUpdateQuestionSet={handleSaveQuestionSet}
        />
      )}

      {/* Comment Modal */}
      {isCommentModalOpen && selectedQuestionSet && (
        <CommentModal
          isOpen={isCommentModalOpen}
          questionSet={selectedQuestionSet}
          comments={comments}
          onClose={() => setIsCommentModalOpen(false)}
          onAddComment={handleAddCommentFromModal}
        />
      )}
    </>
  );
} 