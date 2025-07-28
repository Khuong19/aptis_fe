'use client';

import React, { useState, useEffect } from 'react';
import { Button, Input } from '@/app/components/ui/basic';

import { Trash2, GripVertical, PlusCircle } from 'lucide-react';

export interface OrderingSentence {
  id: string;
  text: string;
  isExample?: boolean;
}

interface SentenceOrderingEditorProps {
  sentences: OrderingSentence[];
  onChange: (sentences: OrderingSentence[]) => void;
  readOnly?: boolean;
}

export const SentenceOrderingEditor: React.FC<SentenceOrderingEditorProps> = ({
  sentences,
  onChange,
  readOnly = false,
}) => {
  const [localSentences, setLocalSentences] = useState<OrderingSentence[]>(sentences);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Update local state when prop changes
  useEffect(() => {
    setLocalSentences(sentences);
  }, [sentences]);

  // Update parent when local state changes
  useEffect(() => {
    onChange(localSentences);
  }, [localSentences, onChange]);

  const handleSentenceChange = (index: number, text: string) => {
    const newSentences = [...localSentences];
    newSentences[index] = { ...newSentences[index], text };
    setLocalSentences(newSentences);
  };

  const handleAddSentence = () => {
    const newId = `sentence-${localSentences.length}`;
    setLocalSentences([
      ...localSentences,
      { id: newId, text: '' }
    ]);
  };

  const handleRemoveSentence = (index: number) => {
    if (localSentences[index].isExample) return; // Don't remove example sentences
    
    const newSentences = [...localSentences];
    newSentences.splice(index, 1);
    setLocalSentences(newSentences);
  };

  const handleToggleExample = (index: number) => {
    const newSentences = [...localSentences];
    
    // If this sentence is already an example, do nothing
    if (newSentences[index].isExample) return;
    
    // Remove example flag from any existing example
    const existingExampleIndex = newSentences.findIndex(s => s.isExample);
    if (existingExampleIndex !== -1) {
      newSentences[existingExampleIndex] = { 
        ...newSentences[existingExampleIndex], 
        isExample: false 
      };
    }
    
    // Set this sentence as the example
    newSentences[index] = { ...newSentences[index], isExample: true };
    setLocalSentences(newSentences);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    const target = e.currentTarget;
    // Add a slight delay for visual feedback
    setTimeout(() => {
      target.classList.add('opacity-50');
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('opacity-50');
    setDraggedIndex(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newSentences = [...localSentences];
    const draggedSentence = newSentences[draggedIndex];
    
    // Remove the dragged item
    newSentences.splice(draggedIndex, 1);
    // Insert it at the new position
    newSentences.splice(index, 0, draggedSentence);
    
    setLocalSentences(newSentences);
    setDraggedIndex(index);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Sentences</h3>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-500">
            Set one sentence as an example (first sentence)
          </div>
          <Button 
            className="whitespace-nowrap"
            type="button" 
            variant="outline" 
            size="sm"
            onClick={handleAddSentence}
            disabled={readOnly}
          >
            <PlusCircle className="w-4 h-4 mr-1" />
            <span>Add Sentence</span>
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        {localSentences.map((sentence, index) => (
          <div
            key={sentence.id}
            draggable={!readOnly}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, index)}
            className={`
              flex items-center gap-2 p-3 rounded-md border border-gray-200
              ${sentence.isExample ? 'bg-blue-50' : 'bg-white'}
              transition-colors
            `}
          >
            <div className={readOnly ? "cursor-not-allowed" : "cursor-move"}>
              <GripVertical className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="flex-grow">
              <Input
                value={sentence.text}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSentenceChange(index, e.target.value)}
                readOnly={readOnly}
                placeholder={`Enter sentence ${index + 1}`}
                className="w-full"
              />
            </div>
            
            <Button
              type="button"
              variant={sentence.isExample ? "default" : "outline"}
              size="sm"
              onClick={() => handleToggleExample(index)}
              disabled={readOnly || sentence.isExample}
            >
              <span>{sentence.isExample ? "Example" : "Set as Example"}</span>
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveSentence(index)}
              disabled={readOnly || localSentences.length <= 2 || sentence.isExample}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
      
      {localSentences.length === 0 && (
        <div className="text-center p-4 border border-dashed rounded-md">
          <p className="text-gray-500">No sentences added yet. Add sentences to create an ordering exercise.</p>
        </div>
      )}
    </div>
  );
};

export default SentenceOrderingEditor;
