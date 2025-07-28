'use client';

import React, { useState, useEffect } from 'react';
import { Badge } from '@/app/components/ui/basic';

interface MatchingDisplayProps {
  partData: any;
  answers: Record<string, string>;
  onAnswerChange: (questionId: string, answer: string) => void;
}

const MatchingDisplay: React.FC<MatchingDisplayProps> = ({ 
  partData, 
  answers, 
  onAnswerChange 
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    // Initialize selected answers from existing answers
    const initAnswers: Record<string, string> = {};
    partData.questions?.forEach((question: any, index: number) => {
      const questionId = question.id || `q${index + 1}`;
      if (answers[questionId]) {
        initAnswers[questionId] = answers[questionId];
      }
    });
    setSelectedAnswers(initAnswers);
  }, [partData, answers]);

  const handleAnswerSelect = (questionId: string, answer: string) => {
    const newAnswers = { ...selectedAnswers };
    
    // If same answer is selected, deselect it
    if (newAnswers[questionId] === answer) {
      delete newAnswers[questionId];
      onAnswerChange(questionId, '');
    } else {
      newAnswers[questionId] = answer;
      onAnswerChange(questionId, answer);
    }
    
    setSelectedAnswers(newAnswers);
  };

  const renderPassage = () => {
    const passage = partData?.passageText || partData?.passage || '';
    if (!passage) return null;

    return (
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200 mb-6">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center mr-3">
            <span className="text-sm">📖</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900">
            {partData.passageTitle || 'Reading Passage'}
          </h3>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-purple-100">
          <div className="prose max-w-none">
            <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">{passage}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderMatchingQuestions = () => {
    const questions = partData.questions || [];
    const options = partData.options || [];

    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-orange-600 text-white rounded-lg flex items-center justify-center mr-3">
            <span className="text-sm">🔗</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900">Match the Questions</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Questions Column */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Questions</h4>
            {questions.map((question: any, index: number) => {
              const questionId = question.id || `q${index + 1}`;
              const selectedAnswer = selectedAnswers[questionId];
              
              return (
                <div 
                  key={questionId}
                  className={`p-4 border rounded-lg transition-colors ${
                    selectedAnswer 
                      ? 'border-green-300 bg-green-50' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
                      {index + 1}
                    </Badge>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium leading-relaxed">
                        {question.text}
                      </p>
                      {selectedAnswer && (
                        <div className="mt-2 p-2 bg-green-100 rounded text-sm text-green-800">
                          <strong>Selected:</strong> {selectedAnswer}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Options Column */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Options</h4>
            {options.map((option: any, index: number) => {
              const optionText = typeof option === 'string' ? option : option.text || option.value;
              const optionKey = typeof option === 'string' ? option : option.key || option.id || optionText;
              
              // Check if this option is already selected
              const isSelected = Object.values(selectedAnswers).includes(optionKey);
              const selectedBy = Object.entries(selectedAnswers).find(([_, value]) => value === optionKey)?.[0];
              
              return (
                <div 
                  key={index}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-green-300 bg-green-50 opacity-75' 
                      : 'border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-50'
                  }`}
                  onClick={() => {
                    if (isSelected && selectedBy) {
                      handleAnswerSelect(selectedBy, optionKey);
                    } else {
                      // Find the first unmatched question to auto-select
                      const unmatchedQuestion = questions.find((q: any, idx: number) => {
                        const qId = q.id || `q${idx + 1}`;
                        return !selectedAnswers[qId];
                      });
                      
                      if (unmatchedQuestion) {
                        const qId = unmatchedQuestion.id || `q${questions.indexOf(unmatchedQuestion) + 1}`;
                        handleAnswerSelect(qId, optionKey);
                      }
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium ${
                      isSelected 
                        ? 'border-green-500 bg-green-500 text-white' 
                        : 'border-gray-300 text-gray-600'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <p className="text-gray-900 leading-relaxed flex-1">
                      {optionText}
                    </p>
                    {isSelected && (
                      <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 text-xs">
                        Selected
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Instructions:</strong> Click on an option to match it with the next available question, 
            or click on a selected option to deselect it.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {renderPassage()}
      {renderMatchingQuestions()}
    </div>
  );
};

export default MatchingDisplay;
