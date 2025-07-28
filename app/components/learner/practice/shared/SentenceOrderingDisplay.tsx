'use client';

import React, { useState, useEffect } from 'react';
import { Badge } from '@/app/components/ui/basic';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface Sentence {
  id: string;
  text: string;
  isExample: boolean;
  position: number;
}

interface SentenceOrderingDisplayProps {
  partData: any;
  userAnswers: any[];
  onOrderChange: (orderedSentences: any[]) => void;
}

const SentenceOrderingDisplay: React.FC<SentenceOrderingDisplayProps> = ({ 
  partData, 
  userAnswers, 
  onOrderChange 
}) => {
  const [orderedSentences, setOrderedSentences] = useState<any[]>([]);

  useEffect(() => {
    // Initialize sentences from different data formats
    let sentences = [];
    
    if (partData.sentences && partData.sentences.length > 0) {
      // New format: sentences directly available
      sentences = partData.sentences.map((s: any, index: number): Sentence => ({
        id: s.id || `sentence-${index}`,
        text: s.text,
        isExample: s.isExample || index === 0,
        position: s.position || index + 1
      }));
    } else if (userAnswers && Array.isArray(userAnswers)) {
      // Parse saved order from userAnswers
      sentences = partData.questions?.map((q: any, index: number): Sentence => ({
        id: q.id || `sentence-${index}`,
        text: q.text || q.sentence || '',
        isExample: q.isExample || index === 0,
        position: userAnswers.indexOf(q.id || `sentence-${index}`) !== -1 ? userAnswers.indexOf(q.id || `sentence-${index}`) : index
      })) || [];
    }

    // Sort by position and separate example sentences
    const exampleSentences = sentences.filter((s: any) => s.isExample);
    const orderableSentences = sentences.filter((s: any) => !s.isExample);
    
    // Shuffle orderable sentences if no existing order
    if (!userAnswers || userAnswers.length === 0) {
      const shuffled = [...orderableSentences].sort(() => Math.random() - 0.5);
      setOrderedSentences([...exampleSentences, ...shuffled]);
    } else {
      // Restore saved order
      const restoredOrder = userAnswers.map((id: string) => 
        sentences.find((s: any) => s.id === id)
      ).filter(Boolean);
      setOrderedSentences([...exampleSentences, ...restoredOrder]);
    }

    if (sentences.length > 0) {
      setOrderedSentences(sentences);
    }
  }, [partData, userAnswers]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(orderedSentences);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setOrderedSentences(items);
    
    // Save the new order
    onOrderChange(items);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-green-600 text-white rounded-lg flex items-center justify-center mr-3">
            <span className="text-sm">🔄</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900">
            {partData.title || 'Sentence Ordering'}
          </h3>
        </div>
        
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg mb-6">
          <p className="text-sm text-blue-800 font-medium">
            📝 Drag and drop the sentences below to put them in the correct order. The first sentence is given as an example.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="sentences">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`space-y-3 ${snapshot.isDraggingOver ? 'bg-green-50' : ''} transition-colors rounded-lg p-2`}
                >
                  {orderedSentences.map((sentence, index) => (
                    <Draggable 
                      key={sentence.id} 
                      draggableId={sentence.id} 
                      index={index}
                      isDragDisabled={sentence.isExample}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`
                            p-4 border rounded-lg transition-all duration-200
                            ${sentence.isExample 
                              ? 'bg-yellow-50 border-yellow-200 cursor-not-allowed' 
                              : snapshot.isDragging 
                                ? 'bg-green-100 border-green-300 shadow-lg transform rotate-1' 
                                : 'bg-white border-gray-200 hover:border-green-300 hover:shadow-md cursor-move'
                            }
                          `}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex items-center gap-2">
                              {sentence.isExample ? (
                                <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300 text-xs">
                                  Example
                                </Badge>
                              ) : (
                                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                                  {index}
                                </div>
                              )}
                              {!sentence.isExample && (
                                <div className="text-gray-400 text-sm">
                                  ⋮⋮
                                </div>
                              )}
                            </div>
                            <p className="text-gray-900 leading-relaxed flex-1">
                              {sentence.text}
                            </p>
                          </div>
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
      </div>
    </div>
  );
};

export default SentenceOrderingDisplay;
