'use client';

import React from 'react';
import { Badge } from '@/app/components/ui/basic';

interface ReadingPartDisplayProps {
  partData: any;
  userAnswers: Record<string, string>;
  onAnswerChange: (questionId: string, answer: string) => void;
}

const ReadingPartDisplay: React.FC<ReadingPartDisplayProps> = ({ 
  partData, 
  userAnswers, 
  onAnswerChange 
}) => {
  const currentPassage = partData?.passageText || partData?.passage || '';

  const renderEmailPassage = (passage: string) => {
    let content = passage;
    let greeting = '';
    
    const greetingMatch = content.match(/^(Hey|Hi|Hello|Dear)\s+[^,]+,/);
    if (greetingMatch) {
      greeting = greetingMatch[0];
      content = content.substring(greeting.length).trim();
    }
    
    let mainContent = content;
    let signature = '';
    
    const signatureMatch = content.match(/(Love|Regards|Best|Sincerely|Yours),\s+[\w\s]+$/i);
    if (signatureMatch) {
      const signatureStart = content.lastIndexOf(signatureMatch[0]);
      mainContent = content.substring(0, signatureStart).trim();
      signature = content.substring(signatureStart).trim();
    }
    
    return (
      <div className="email-container bg-white border border-gray-200 rounded-md p-5 shadow-sm">
        <div className="email-header border-b pb-3 mb-3">
          <div className="flex justify-between">
            <div>
              <p className="font-medium text-gray-700">Email Message</p>
            </div>
          </div>
        </div>
        <div className="email-body">
          {greeting && <p className="text-sm font-medium mb-3">{greeting}</p>}
          <p className="text-sm whitespace-pre-wrap leading-relaxed mb-4">{mainContent}</p>
          {signature && <p className="text-sm whitespace-pre-wrap leading-relaxed mt-2">{signature}</p>}
        </div>
      </div>
    );
  };

  const renderMultipleChoiceQuestions = () => {
    return (
      <div className="space-y-6">
        {partData.questions?.map((question: any, index: number) => (
          <div key={question.id || index} className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
            <div className="mb-4">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
                  {index + 1}
                </Badge>
                <p className="text-gray-900 font-medium leading-relaxed flex-1">
                  {question.text}
                </p>
              </div>
            </div>
            
            <div className="space-y-3 ml-10">
              {Object.entries(question.options || {}).map(([key, value]: [string, any]) => (
                <label 
                  key={key} 
                  className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name={`question-${question.id || index}`}
                    value={key}
                    checked={userAnswers[question.id || `q${index + 1}`] === key}
                    onChange={() => onAnswerChange(question.id || `q${index + 1}`, key)}
                    className="mt-0.5 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700 min-w-[20px]">{key}.</span>
                    <span className="text-gray-900">{value}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Determine part type based on data structure
  const hasQuestions = partData?.questions && partData.questions.length > 0;
  const hasPassage = currentPassage && currentPassage.length > 0;
  
  if (hasQuestions && hasPassage) {
    return (
      <div className="space-y-8">
        {/* Passage Section */}
        {currentPassage && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center mr-3">
                <span className="text-sm">📖</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                {partData.passageTitle || 'Reading Passage'}
              </h3>
            </div>
            {renderEmailPassage(currentPassage)}
          </div>
        )}

        {/* Questions Section */}
        <div>
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-green-600 text-white rounded-lg flex items-center justify-center mr-3">
              <span className="text-sm">❓</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Questions</h3>
          </div>
          {renderMultipleChoiceQuestions()}
        </div>
      </div>
    );
  }

  // For other part types, return existing implementation
  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg">
        <p className="text-gray-600">This part type is not yet supported by the shared UI component.</p>
      </div>
    </div>
  );
};

export default ReadingPartDisplay;
