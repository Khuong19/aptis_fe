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
  // Use useRef to avoid dependency on onOrderChange
  const onOrderChangeRef = useRef(onOrderChange);
  
  useEffect(() => {
    onOrderChangeRef.current = onOrderChange;
  }, [onOrderChange]);

  useEffect(() => {
    if (onOrderChangeRef.current) {
      onOrderChangeRef.current(orderedSentences);
    }
  }, [orderedSentences]); // Remove onOrderChange dependency

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, sentence: OrderingSentence, index: number) => {
    if (readOnly || sentence.isExample) return;
    
    e.dataTransfer.setData('text/plain', sentence.id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedSentence(sentence);
    
    // Add visual feedback immediately
    e.currentTarget.style.opacity = '0.5';
    e.currentTarget.style.transform = 'scale(0.98)';
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    if (readOnly) return;
    
    // Reset visual feedback
    e.currentTarget.style.opacity = '1';
    e.currentTarget.style.transform = 'scale(1)';
    setDraggedSentence(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (readOnly || orderedSentences[index].isExample) return;
    
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    if (readOnly || orderedSentences[dropIndex].isExample || !draggedSentence) return;
    
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
          : (
            <div>
              <p>Drag and drop the sentences to put them in the correct order. The first sentence is provided as an example.</p>
              <p className="mt-2 text-xs text-gray-500">
                💡 Tip: Look for words that connect sentences together (like "however", "then", "first", etc.)
              </p>
            </div>
          )}
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
              p-4 rounded-md border group relative
              ${sentence.isExample ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}
              ${dragOverIndex === index ? 'border-blue-500 border-2 shadow-md bg-blue-50' : ''}
              ${!readOnly && !sentence.isExample ? 'hover:border-gray-300 hover:shadow-sm cursor-move' : 'cursor-default'}
              transition-all duration-200
            `}
            style={{ userSelect: 'none' }}
          >
            <div className="flex items-start">
              <div className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium mr-4 ${
                sentence.isExample ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'
              }`}>
                {index + 1}
              </div>
              <div className="flex-grow text-gray-900 leading-relaxed">{sentence.text}</div>
              <div className="flex items-center ml-4 space-x-2">
                {sentence.isExample && (
                  <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                    Example
                  </div>
                )}
                {!readOnly && !sentence.isExample && (
                  <div className="flex flex-col items-center text-gray-400 group-hover:text-gray-600 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M10 4a2 2 0 11-4 0 2 2 0 014 0zM10 8a2 2 0 11-4 0 2 2 0 014 0zM10 12a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    <span className="text-xs mt-1">Drag</span>
                  </div>
                )}
              </div>
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
