'use client';

import React, { useState } from 'react';
import { Badge, Button, Input } from '@/app/components/ui/basic';
import toast from 'react-hot-toast';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import ViewEditQuestionModal from '../../modals/ViewEditQuestionModal';

interface ReadingPart2Props {
  previewData: any;
  onEdit?: (updatedData: any) => void;
}

const ReadingPart2: React.FC<ReadingPart2Props> = ({ previewData, onEdit }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Helper function to sort sentences in correct order with example first
  const getSortedSentences = (sentences: any[]) => {
    if (!sentences || sentences.length === 0) return [];
    
    // Separate example and non-example sentences
    const exampleSentences = sentences.filter(s => s.isExample);
    const nonExampleSentences = sentences.filter(s => !s.isExample);
    
    // Sort non-example sentences by position
    nonExampleSentences.sort((a, b) => (a.position || 0) - (b.position || 0));
    
    // Return with example sentences first (at index 0), then others in correct order
    return [...exampleSentences, ...nonExampleSentences];
  };
  
  // State cho drag-and-drop - initialize with sorted sentences
  const [orderedSentences, setOrderedSentences] = useState<any[]>(
    getSortedSentences(previewData?.questions?.[0]?.sentences || [])
  );

  // Handle case where questions might not have sentences property
  const questions = previewData?.questions || [];
  const hasSentences = questions.length > 0 && questions[0]?.sentences?.length > 0;

  // Transform previewData into QuestionSet format for the modal
  const questionSetForModal = {
    id: 'preview-part2',
    title: previewData?.title || 'Reading Part 2 - Sentence Ordering',
    description: 'B1 level sentence ordering task',
    type: 'reading' as const,
    part: 2,
    level: 'B1' as const,
    source: 'ai-generated' as const,
    questions: previewData?.questions || [],
    passageText: hasSentences ? JSON.stringify(questions[0].sentences) : '',
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
    if (onEdit && updatedQuestionSet.passageText) {
      try {
        // Parse the updated sentences from passageText
        const updatedSentences = JSON.parse(updatedQuestionSet.passageText);
        
        // Transform back to the expected format
        const updatedData = {
          ...previewData,
          title: updatedQuestionSet.title,
          questions: [{
            id: 'part2-sentences',
            text: 'Sentence ordering task',
            sentences: updatedSentences,
            options: {},
            answer: ''
          }]
        };
        
        onEdit(updatedData);
        toast.success('Sentences updated successfully!');
      } catch (error) {
        console.error('Error parsing updated sentences:', error);
        toast.error('Failed to update sentences');
      }
    }
  };


  // Drag and drop handler
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newOrder = Array.from(orderedSentences);
    const [removed] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, removed);
    setOrderedSentences(newOrder);
  };

  // If no valid data is available, show a message
  if (!hasSentences) {
    return (
      <div className="p-4 border rounded-md bg-yellow-50">
        <p className="text-amber-700">This question set doesn't have properly formatted sentences for Reading Part 2.</p>
        {onEdit && (
          <Button 
            type="button"
            variant="outline"
            size="sm"
            onClick={handleOpenEditModal}
            className="mt-2"
          >
            Create Sentences
          </Button>
        )}
      </div>
    );
  }

  // If no ordered sentences, show create option
  if (!orderedSentences.length) {
    return (
      <div className="p-4 border rounded-md bg-yellow-50">
        <p className="text-amber-700">This question set doesn't have properly formatted sentences for Reading Part 2.</p>
        {onEdit && (
          <Button 
            type="button"
            variant="outline"
            size="sm"
            onClick={handleOpenEditModal}
            className="mt-2"
          >
            Create Sentences
          </Button>
        )}
      </div>
    );
  }

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Sentences in Correct Order</h3>
          {onEdit && (
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={handleOpenEditModal}
                className="flex items-center gap-1"
              >
                <span className="h-4 w-4">✏️</span> Edit Sentences
              </Button>
            </div>
          )}
        </div>
        
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="sentences-droppable">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {orderedSentences.map((sentence: any, index: number) => (
                  <Draggable key={sentence.id || index} draggableId={String(sentence.id || index)} index={index} isDragDisabled={sentence.isExample}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`p-3 border rounded-md flex items-center gap-3 bg-white shadow-sm ${
                          sentence.isExample ? 'bg-blue-50 border-blue-200' : snapshot.isDragging ? 'bg-green-50' : 'bg-gray-50'
                        }`}
                      >
                        <span className="font-bold text-gray-500">{index + 1}</span>
                        <p className="flex-1">{sentence.text}</p>
                        {sentence.isExample && <Badge variant="default">Example</Badge>}
                        {!sentence.isExample && <span className="cursor-move text-gray-400">☰</span>}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* Edit Modal */}
      <ViewEditQuestionModal
        isOpen={showEditModal}
        questionSet={questionSetForModal}
        isEditable={true}
        onClose={handleCloseEditModal}
        onUpdateQuestionSet={handleUpdateQuestionSet}
        startInEditMode={true}
      />
    </>
  );
};

export default ReadingPart2; 