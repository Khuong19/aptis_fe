'use client';

import React, { useState, useEffect } from 'react';

interface SimpleReadingPart4DisplayProps {
  partData: any;
  answers: Record<string, string>;
  onAnswerChange: (questionId: string, answer: string) => void;
}

const SimpleReadingPart4Display: React.FC<SimpleReadingPart4DisplayProps> = ({ 
  partData, 
  answers, 
  onAnswerChange 
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    // Initialize selected answers from existing answers
    const initAnswers: Record<string, string> = {};
    const questions = partData.questions || [];
    questions.forEach((question: any) => {
      const questionId = `${partData.id}-${question.id}`;
      if (answers[questionId]) {
        initAnswers[questionId] = answers[questionId];
      }
    });
    setSelectedAnswers(initAnswers);
  }, [partData, answers]);

  const handleAnswerSelect = (questionId: string, answer: string) => {
    const newAnswers = { ...selectedAnswers, [questionId]: answer };
    setSelectedAnswers(newAnswers);
    onAnswerChange(questionId, answer);
  };

  const questions = partData.questions || [];
  const headings = partData.headings || {};
  
  // Convert headings object to array for dropdown options
  const headingOptions = Object.entries(headings).map(([key, value]) => ({
    id: key.replace('Heading', ''), // Remove 'Heading' prefix if present
    text: value as string
  }));

  // Extract the passage content - try different possible fields
  const passageContent = partData.passageText || partData.content || '';
  const title = partData.title || 'Reading Passage';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Instructions */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm font-medium text-gray-800">
          Read the passage quickly. Choose a heading for each numbered paragraph (1-7) from the drop-down box. There is one more heading than you need.
        </p>
      </div>

      {/* Title */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      </div>

      {/* Questions with dropdowns */}
      <div className="space-y-6">
        {questions.map((question: any, index: number) => {
          const questionId = `${partData.id}-${question.id}`;
          const selectedHeading = selectedAnswers[questionId] || '';
          const isExample = question.isExample;
          
          return (
            <div key={question.id} className="space-y-3">
              {/* Section number and dropdown */}
              <div className="flex items-center gap-3">
                <span className="font-semibold text-lg min-w-[2rem]">
                  {question.sectionNumber + 1}.
                </span>
                
                {isExample ? (
                  // Example dropdown - disabled and showing correct answer
                  <select
                    className="px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-600 min-w-[300px]"
                    value={question.answer}
                    disabled
                  >
                    <option value={question.answer}>
                      {headings[`Heading${question.answer}`] || question.answer}
                    </option>
                  </select>
                ) : (
                  // Regular dropdown
                  <select
                    className="px-3 py-2 border border-gray-300 rounded bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[300px]"
                    value={selectedHeading}
                    onChange={(e) => handleAnswerSelect(questionId, e.target.value)}
                  >
                    <option value="">Choose a heading...</option>
                    {headingOptions.map((heading) => (
                      <option key={heading.id} value={heading.id}>
                        {heading.text}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Section content */}
              <div className="ml-8 text-gray-800 leading-relaxed">
                <p>{question.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SimpleReadingPart4Display;
