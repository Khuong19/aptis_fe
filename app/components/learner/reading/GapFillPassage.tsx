'use client';

import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Card, CardContent } from '@/app/components/ui/basic';

export interface GapFillQuestion {
  id: string;
  options: string[]; // Exactly 3 options per gap
  answer: string;
}

export interface GapFillPassageProps {
  title: string;
  passage: string; // Passage with [Q1], [Q2], etc. as placeholders
  questions: GapFillQuestion[];
  onAnswerChange?: (questionId: string, answer: string) => void;
  readOnly?: boolean;
  userAnswers?: Record<string, string>;
}

const GapFillPassage: React.FC<GapFillPassageProps> = ({
  title,
  passage,
  questions,
  onAnswerChange,
  readOnly = false,
  userAnswers = {}
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>(userAnswers || {});

  const handleSelectChange = (questionId: string, value: string): void => {
    const newAnswers = {
      ...selectedAnswers,
      [questionId]: value
    };
    setSelectedAnswers(newAnswers);
    
    if (onAnswerChange) {
      onAnswerChange(questionId, value);
    }
  };

  // Process the text to replace placeholders with select components
  const renderPassageContent = () => {
    // Split the passage content by question placeholders
    let content: React.ReactNode[] = [];
    let currentText = passage;
    
    questions.forEach((question, index) => {
      const placeholder = `[Q${index + 1}]`;
      const parts = currentText.split(placeholder);
      
      if (parts.length > 1) {
        // Add text before placeholder
        content.push(<span key={`text-${index}-1`}>{parts[0]}</span>);
        
        // Add select component
        content.push(
          <select
            key={`select-${question.id}`}
            value={selectedAnswers[question.id] || ''}
            onChange={(e) => handleSelectChange(question.id, e.target.value)}
            disabled={readOnly}
            className="inline-block mx-2 px-3 py-1.5 border-2 border-blue-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium shadow-sm hover:border-blue-400 transition-all duration-200"
          >
            <option value="" disabled className="text-gray-400">Select...</option>
            {question.options.map((option) => (
              <option key={option} value={option} className="text-gray-900">
                {option}
              </option>
            ))}
          </select>
        );
        
        // Update current text to the remainder
        currentText = parts[1];
      }
    });
    
    // Add any remaining text
    if (currentText) {
      content.push(<span key="text-final">{currentText}</span>);
    }
    
    return content;
  };

  return (
    <div className="w-full">
      {title && (
        <h2 className="text-lg font-semibold mb-4 text-gray-900">{title}</h2>
      )}
      
      <div className="prose max-w-none">
        <div className="text-gray-900 leading-relaxed text-base font-medium bg-gradient-to-br from-gray-50 to-white p-6 rounded-lg border border-gray-200 shadow-inner">
          {renderPassageContent()}
        </div>
      </div>
    </div>
  );
};

export default GapFillPassage;
