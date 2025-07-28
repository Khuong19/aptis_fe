'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, Button } from '@/app/components/ui/basic';

export interface OrderingSentence {
  id: string;
  text: string;
  isExample?: boolean;
  originalIndex?: number;
}

interface SentenceOrderingComponentProps {
  title?: string;
  sentences: OrderingSentence[];
  onOrderChange?: (orderedSentences: OrderingSentence[]) => void;
  readOnly?: boolean;
  userAnswers?: string[]; // Array of sentence IDs in user's order
}

export const SentenceOrderingComponent: React.FC<SentenceOrderingComponentProps> = ({
  title,
  sentences,
  onOrderChange,
  readOnly = false,
  userAnswers = [],
}) => {
  // Initialize with provided sentences, respecting any pre-defined user answers
  const initializeSentences = () => {
    if (userAnswers.length > 0) {
      // If we have user answers, order according to them
      const orderedSentences = [...sentences];
      const nonExampleSentences = orderedSentences.filter(s => !s.isExample);
      
      // Create a new array with examples in place and other sentences ordered by userAnswers
      return orderedSentences.map(s => {
        if (s.isExample) return s;
        const userOrderIndex = userAnswers.indexOf(s.id);
        return userOrderIndex !== -1 ? nonExampleSentences[userOrderIndex] : s;
      });
    }
    return [...sentences];
  };

  const [orderedSentences, setOrderedSentences] = useState<OrderingSentence[]>(initializeSentences);
  const [draggedSentence, setDraggedSentence] = useState<OrderingSentence | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Update parent component when order changes
  useEffect(() => {
    if (onOrderChange) {
      onOrderChange(orderedSentences);
    }
  }, [orderedSentences, onOrderChange]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, sentence: OrderingSentence, index: number) => {
    if (readOnly || sentence.isExample) return;
    
    e.dataTransfer.setData('text/plain', sentence.id);
    setDraggedSentence(sentence);
    
    // Add a slight delay for visual feedback
    setTimeout(() => {
      e.currentTarget.classList.add('opacity-50');
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    if (readOnly) return;
    
    e.currentTarget.classList.remove('opacity-50');
    setDraggedSentence(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (readOnly || sentences[index].isExample) return;
    
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    if (readOnly || sentences[dropIndex].isExample || !draggedSentence) return;
    
    const draggedId = e.dataTransfer.getData('text/plain');
    const dragIndex = orderedSentences.findIndex(s => s.id === draggedId);
    
    if (dragIndex !== -1 && dragIndex !== dropIndex) {
      const newOrderedSentences = [...orderedSentences];
      const [removed] = newOrderedSentences.splice(dragIndex, 1);
      newOrderedSentences.splice(dropIndex, 0, removed);
      
      setOrderedSentences(newOrderedSentences);
    }
    
    setDraggedSentence(null);
    setDragOverIndex(null);
  };

  const resetOrder = () => {
    setOrderedSentences([...sentences]);
  };

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-medium mb-4 text-gray-900">{title}</h3>
      )}
      
      <div className="text-sm text-gray-600 mb-6">
        {readOnly 
          ? "Review the order of sentences below."
          : "Drag and drop the sentences to put them in the correct order. The first sentence is provided as an example."}
      </div>
      
      <div className="space-y-3">
        {orderedSentences.map((sentence, index) => (
          <div
            key={sentence.id}
            draggable={!readOnly && !sentence.isExample}
            onDragStart={(e) => handleDragStart(e, sentence, index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            className={`
              p-4 rounded-md border cursor-${!readOnly && !sentence.isExample ? 'move' : 'default'}
              ${sentence.isExample ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}
              ${dragOverIndex === index ? 'border-blue-500 border-2 shadow-md' : ''}
              ${!readOnly && !sentence.isExample ? 'hover:border-gray-300 hover:shadow-sm' : ''}
              transition-all duration-200
            `}
          >
            <div className="flex items-start">
              <div className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium mr-4 ${
                sentence.isExample ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'
              }`}>
                {index + 1}
              </div>
              <div className="flex-grow text-gray-900 leading-relaxed">{sentence.text}</div>
              {sentence.isExample && (
                <div className="ml-4 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                  Example
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {!readOnly && (
        <div className="mt-6 flex justify-end">
          <button 
            onClick={resetOrder}
            className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Reset Order
          </button>
        </div>
      )}
    </div>
  );
};

export default SentenceOrderingComponent;
