'use client';

import React, { useState, useEffect } from 'react';
import { Badge } from '@/app/components/ui/basic';

interface ParagraphHeadingMatchingDisplayProps {
  partData: any;
  answers: Record<string, string>;
  onAnswerChange: (questionId: string, answer: string) => void;
}

const ParagraphHeadingMatchingDisplay: React.FC<ParagraphHeadingMatchingDisplayProps> = ({ 
  partData, 
  answers, 
  onAnswerChange 
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    // Initialize selected answers from existing answers
    const initAnswers: Record<string, string> = {};
    const questions = partData.questions || [];
    questions.forEach((question: any, index: number) => {
      const questionId = `${partData.id}-${question.id || index}`;
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

  const renderInstructions = () => {
    return (
      <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-xs">📖</span>
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">Instructions</h4>
            <p className="text-blue-800 text-sm leading-relaxed">
              Read each paragraph carefully and match it with the most suitable heading from the options provided. 
              Each heading can only be used once, and there may be extra headings that you don't need to use.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderMainContent = () => {
    const questions = partData.questions || [];
    const headings = partData.headings || {};
    
    // Filter out example questions for selection
    const selectableQuestions = questions.filter((q: any) => !q.isExample);

    // Convert headings object to array for easier rendering
    const headingOptions = Object.entries(headings).map(([key, value]) => ({
      id: key,
      text: value as string
    }));

    // Track which headings have been used
    const usedHeadings = new Set(Object.values(selectedAnswers));

    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center mr-3">
            <span className="text-sm">🔗</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900">Match Paragraphs to Headings</h3>
        </div>

        <div className="space-y-6">
          {/* Show passage text first if available */}
          {partData.passageText && (
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Reading Passage</h4>
              <div className="text-gray-900 leading-relaxed whitespace-pre-line">
                {partData.passageText}
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Questions/Sections Column */}
            <div className="lg:col-span-2 space-y-6">
              <h4 className="font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Sections to Match {questions.some((q: any) => q.isExample) && '(Example shown)'}
              </h4>
              
              {questions.map((question: any, index: number) => {
                const questionId = `${partData.id}-${question.id}`;
                const selectedHeading = selectedAnswers[questionId];
                const isExample = question.isExample;
                
                return (
                  <div 
                    key={questionId}
                    className={`p-5 border rounded-lg transition-all duration-200 ${
                      isExample 
                        ? 'border-blue-300 bg-blue-50' 
                        : selectedHeading 
                          ? 'border-green-300 bg-green-50 shadow-sm' 
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <Badge 
                        variant="outline" 
                        className={`font-medium flex-shrink-0 mt-1 ${
                          isExample 
                            ? 'bg-blue-50 text-blue-700 border-blue-200' 
                            : 'bg-purple-50 text-purple-700 border-purple-200'
                        }`}
                      >
                        {isExample ? 'Example' : `Section ${question.sectionNumber + 1}`}
                      </Badge>
                      <div className="flex-1">
                        <p className="text-gray-900 leading-relaxed mb-3">
                          {question.text}
                        </p>
                        
                        {isExample && (
                          <div className="mt-3 p-3 bg-blue-100 rounded-lg border border-blue-200">
                            <div className="flex items-center gap-2">
                              <span className="text-blue-700 font-medium text-sm">Correct Answer:</span>
                              <Badge className="bg-blue-600 text-white">
                                {question.answer}
                              </Badge>
                              <span className="text-blue-700 text-sm">
                                {headings[`Heading${question.answer}`]}
                              </span>
                            </div>
                          </div>
                        )}
                        
                        {!isExample && selectedHeading && (
                          <div className="mt-3 p-3 bg-green-100 rounded-lg border border-green-200">
                            <div className="flex items-center gap-2">
                              <span className="text-green-700 font-medium text-sm">Selected Heading:</span>
                              <Badge className="bg-green-600 text-white">
                                {selectedHeading}
                              </Badge>
                              <span className="text-green-700 text-sm">
                                {headings[selectedHeading]}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Headings Options Column */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Available Headings</h4>
            <div className="space-y-3">
              {headingOptions.map((heading) => {
                const isUsed = usedHeadings.has(heading.id);
                
                return (
                  <div
                    key={heading.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      isUsed
                        ? 'border-green-300 bg-green-50 opacity-60'
                        : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Badge 
                        variant="outline" 
                        className={`font-medium flex-shrink-0 ${
                          isUsed 
                            ? 'bg-green-100 text-green-700 border-green-300' 
                            : 'bg-purple-50 text-purple-700 border-purple-200'
                        }`}
                      >
                        {heading.id}
                      </Badge>
                      <div className="flex-1">
                        <p className={`text-sm leading-relaxed ${
                          isUsed ? 'text-gray-600' : 'text-gray-900'
                        }`}>
                          {heading.text}
                        </p>
                        {isUsed && (
                          <div className="mt-2 text-xs text-green-600 font-medium flex items-center gap-1">
                            <span>✓</span>
                            <span>Used</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

          {/* Selection Area */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-4">Make Your Selections</h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectableQuestions.map((question: any, index: number) => {
                const questionId = `${partData.id}-${question.id}`;
                const selectedHeading = selectedAnswers[questionId];
                
                return (
                  <div key={questionId} className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        Section {question.sectionNumber + 1}
                      </Badge>
                    </div>
                    
                    <select
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={selectedHeading || ''}
                      onChange={(e) => handleAnswerSelect(questionId, e.target.value)}
                    >
                      <option value="">Select a heading...</option>
                      {headingOptions.map((heading) => (
                        <option 
                          key={heading.id} 
                          value={heading.id}
                          disabled={usedHeadings.has(heading.id) && selectedHeading !== heading.id}
                        >
                          {heading.id}: {heading.text}
                        </option>
                      ))}
                    </select>
                    
                    {selectedHeading && (
                      <div className="mt-2 text-xs text-green-600 font-medium">
                        ✓ Heading {selectedHeading} selected
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-blue-700 font-medium text-sm">
                Progress: {Object.keys(selectedAnswers).length} of {selectableQuestions.length} sections matched
              </span>
              <div className="flex gap-1">
                {selectableQuestions.map((question: any) => {
                  const questionId = `${partData.id}-${question.id}`;
                  const isAnswered = selectedAnswers[questionId];
                  
                  return (
                    <div
                      key={questionId}
                      className={`w-3 h-3 rounded-full ${
                        isAnswered ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {renderInstructions()}
      {renderMainContent()}
    </div>
  );
};

export default ParagraphHeadingMatchingDisplay;
