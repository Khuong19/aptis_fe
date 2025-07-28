'use client';

import React, { useState } from 'react';
import { Button } from '@/app/components/ui/basic';
import { Badge } from '@/app/components/ui/basic';
import { Loader2, Sparkles, BookOpen, Volume2, Brain, Zap } from 'lucide-react';

// Simple toast notification function
const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  // Simple alert for now - can be replaced with proper toast later
  if (type === 'error') {
    alert(`Error: ${message}`);
  } else {
    alert(`Success: ${message}`);
  }
};

// Import shared components for preview
import ReadingPart1 from '../shared/ReadingPart1';
import ReadingPart2 from '../shared/ReadingPart2';
import ReadingPart3 from '../shared/ReadingPart3';
import ReadingPart4 from '../shared/ReadingPart4';

interface AIGeneratedQuestionsProps {
  onQuestionSetCreated?: (questionSet: any) => void;
  onPreviewData?: (data: any) => void;
}

interface GenerationParams {
  type: 'reading' | 'listening';
  part: string;
  topic: string;
  level: string;
  questionCount: number;
}

const AIGeneratedQuestions: React.FC<AIGeneratedQuestionsProps> = ({
  onQuestionSetCreated,
  onPreviewData
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<any>(null);
  const [params, setParams] = useState<GenerationParams>({
    type: 'reading',
    part: '1',
    topic: '',
    level: 'B1',
    questionCount: 5
  });

  const partLevels = {
    '1': 'A2',
    '2': 'B1', 
    '3': 'B2',
    '4': 'C1'
  };

  const questionCounts = {
    '1': 5,
    '2': 5,
    '3': 7,
    '4': 7
  };

  const handlePartChange = (newPart: string) => {
    setParams(prev => ({
      ...prev,
      part: newPart,
      level: partLevels[newPart as keyof typeof partLevels],
      questionCount: questionCounts[newPart as keyof typeof questionCounts]
    }));
  };

  const generateQuestions = async () => {
    if (!params.topic.trim()) {
      showToast("Please enter a topic for the test", 'error');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai-questions/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          type: params.type,
          part: params.part,
          topic: params.topic,
          level: params.level,
          questionCount: params.questionCount
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to generate questions: ${response.statusText}`);
      }

      const data = await response.json();
      setGeneratedData(data);
      
      if (onPreviewData) {
        onPreviewData(data);
      }

      showToast(`Generated ${params.type} test for Part ${params.part}`);

    } catch (error) {
      console.error('Error generating questions:', error);
      showToast(error instanceof Error ? error.message : "Failed to generate questions", 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveQuestionSet = async () => {
    if (!generatedData) return;

    try {
      const response = await fetch('/api/ai-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(generatedData)
      });

      if (!response.ok) {
        throw new Error('Failed to save question set');
      }

      const savedData = await response.json();
      
      if (onQuestionSetCreated) {
        onQuestionSetCreated(savedData);
      }

      showToast("AI-generated question set saved successfully");

      // Reset form
      setGeneratedData(null);
      setParams(prev => ({ ...prev, topic: '' }));

    } catch (error) {
      console.error('Error saving question set:', error);
      showToast("Failed to save the question set", 'error');
    }
  };

  const renderPreview = () => {
    if (!generatedData) return null;

    const previewProps = {
      previewData: generatedData,
      onEdit: undefined // Read-only preview
    };

    switch (params.part) {
      case '1':
        return <ReadingPart1 {...previewProps} />;
      case '2':
        return <ReadingPart2 {...previewProps} />;
      case '3':
        return <ReadingPart3 {...previewProps} />;
      case '4':
        return <ReadingPart4 {...previewProps} />;
      default:
        return <div className="p-4 text-gray-500">Preview not available for this part</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Sparkles className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI-Generated Questions</h2>
          <p className="text-gray-600">Create APTIS tests using advanced AI technology</p>
        </div>
      </div>

      {/* Generation Form */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Brain className="h-5 w-5 text-blue-600" />
            <span>Test Generation Parameters</span>
          </h3>
        </div>
        <div className="p-6 space-y-6">
          {/* Test Type Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Test Type</label>
            <div className="flex space-x-4">
              <Button
                type="button"
                variant={params.type === 'reading' ? 'default' : 'outline'}
                onClick={() => setParams(prev => ({ ...prev, type: 'reading' }))}
                className="flex items-center space-x-2"
              >
                <BookOpen className="h-4 w-4" />
                <span>Reading</span>
              </Button>
              <Button
                type="button"
                variant={params.type === 'listening' ? 'default' : 'outline'}
                onClick={() => setParams(prev => ({ ...prev, type: 'listening' }))}
                className="flex items-center space-x-2"
              >
                <Volume2 className="h-4 w-4" />
                <span>Listening</span>
              </Button>
            </div>
          </div>

          {/* Part Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Test Part</label>
            <div className="grid grid-cols-4 gap-2">
              {['1', '2', '3', '4'].map((part) => (
                <Button
                  key={part}
                  type="button"
                  variant={params.part === part ? 'default' : 'outline'}
                  onClick={() => handlePartChange(part)}
                  className="flex flex-col items-center p-4 h-auto"
                >
                  <span className="text-lg font-bold">Part {part}</span>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {partLevels[part as keyof typeof partLevels]}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>

          {/* Topic Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Topic</label>
            <input
              type="text"
              value={params.topic}
              onChange={(e) => setParams(prev => ({ ...prev, topic: e.target.value }))}
              placeholder="Enter the topic for your test (e.g., 'Environmental Protection', 'Technology in Education')"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Level and Question Count Display */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Level</label>
              <div className="p-3 bg-gray-50 rounded-lg">
                <Badge variant="outline" className="text-sm">
                  {params.level}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Questions</label>
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">{params.questionCount} questions</span>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={generateQuestions}
            disabled={isGenerating || !params.topic.trim()}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Generating Questions...</span>
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                <span>Generate AI Questions</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Preview Section */}
      {generatedData && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Generated Test Preview</h3>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  AI Generated
                </Badge>
                <Badge variant="outline">
                  Part {params.part} - {params.level}
                </Badge>
                <Button
                  onClick={saveQuestionSet}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Save Question Set
                </Button>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {renderPreview()}
              

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIGeneratedQuestions;
