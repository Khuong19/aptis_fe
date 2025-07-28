'use client';

import { Card, CardContent } from '@/app/components/ui/basic';
import { Question } from '@/app/types/question-bank';

interface QuestionPreviewProps {
  question: any;
  index: number;
  part: string;
}

const QuestionPreview = ({ question, index, part }: QuestionPreviewProps) => {
  // Handle different question formats based on part
  const renderQuestionContent = () => {
    const partNum = parseInt(part);
    
    switch (partNum) {
      case 1: // Gap-filling format
        return (
          <div className="space-y-4">
            {index === 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">Passage</h3>
                <div className="border rounded-md p-4 bg-gray-50">
                  <p>
                    {question.passage}
                  </p>
                </div>
              </div>
            )}
            
            <div>
              <div className="flex items-center mb-2">
                <span className="font-medium mr-2">{index + 1}. Gap {index + 1}</span>
              </div>
              
              <div className="space-y-2">
                {Object.entries(question.options || {}).map(([key, value]) => (
                  <div 
                    key={key} 
                    className={`flex items-start p-2 rounded-md ${question.answer === key ? 'bg-green-100' : ''}`}
                  >
                    <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full mr-2 ${
                      question.answer === key ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {key}
                    </span>
                    <span>{value as string}</span>
                  </div>
                ))}
              </div>
              
              {question.explanation && (
                <div className="mt-2 text-sm text-gray-600">
                  <span className="font-medium">Explanation:</span> {question.explanation}
                </div>
              )}
            </div>
          </div>
        );
        
      case 2: // Sentence completion
        return (
          <>
            <p className="font-medium mb-2">Q{index + 1}: {question.text}</p>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(question.options || {}).map(([key, value]) => (
                <div key={key} className="flex items-start border rounded-md p-2">
                  <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full mr-2 ${
                    question.answer === key ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {key}
                  </span>
                  <span>{value as string}</span>
                </div>
              ))}
            </div>
            {question.explanation && (
              <div className="mt-2 text-sm text-gray-600">
                <span className="font-medium">Explanation:</span> {question.explanation}
              </div>
            )}
          </>
        );
        
      case 3: // Reading comprehension with passages
        return (
          <>
            <div className="flex items-center mb-2">
              <span className="font-medium mr-2">Q{index + 1}:</span>
              {question.passageId && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">
                  Passage {question.passageId}
                </span>
              )}
              <span>{question.text}</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(question.options || {}).map(([key, value]) => (
                <div key={key} className="flex items-start border rounded-md p-2">
                  <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full mr-2 ${
                    question.answer === key ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {key}
                  </span>
                  <span>{value as string}</span>
                </div>
              ))}
            </div>
            {question.explanation && (
              <div className="mt-2 text-sm text-gray-600">
                <span className="font-medium">Explanation:</span> {question.explanation}
              </div>
            )}
          </>
        );
        
      case 4: // Text completion
        return (
          <>
            <p className="font-medium mb-2">Q{index + 1}: {question.text}</p>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(question.options || {}).map(([key, value]) => (
                <div key={key} className="flex items-start border rounded-md p-2">
                  <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full mr-2 ${
                    question.answer === key ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {key}
                  </span>
                  <span>{value as string}</span>
                </div>
              ))}
            </div>
            {question.explanation && (
              <div className="mt-2 text-sm text-gray-600">
                <span className="font-medium">Explanation:</span> {question.explanation}
              </div>
            )}
          </>
        );
        
      default:
        return (
          <>
            <p className="font-medium mb-2">Q{index + 1}: {question.text}</p>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(question.options || {}).map(([key, value]) => (
                <div key={key} className="flex items-start border rounded-md p-2">
                  <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full mr-2 ${
                    question.answer === key ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {key}
                  </span>
                  <span>{value as string}</span>
                </div>
              ))}
            </div>
          </>
        );
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        {renderQuestionContent()}
      </CardContent>
    </Card>
  );
};

export default QuestionPreview;
