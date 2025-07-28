'use client';

import React, { useState } from 'react';
import { Button } from '@/app/components/ui/basic';
import { 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle, 
  Wand2,
  Edit3,
  Save
} from 'lucide-react';
import { QuestionSet } from '@/app/types/question-bank';
import { fetchWithAuth } from '@/app/lib/auth/apiInterceptor';

// Step components
import StepOneTextGeneration from './StepOneTextGeneration';
import StepTwoPreviewEdit from './StepTwoPreviewEdit';

interface ReadingMultiStepCreatorProps {
  onSuccess: (generatedSets: QuestionSet[]) => void;
}

export interface StepData {
  // Basic configuration
  part: string;
  generationType: 'paraphrase' | 'new';
  topic: string;
  level: string;
  
  // Generated content
  generatedQuestions: any[];
  passageText: string;
  passages: any[];
  title: string;
  
  // Step completion flags
  textGenerated: boolean;
  finalReview: boolean;
}

const STEPS = [
  { id: 1, name: 'Generate Text', icon: Wand2, description: 'Generate reading questions with AI' },
  { id: 2, name: 'Preview & Edit', icon: Edit3, description: 'Review and edit generated content' },
];

const PART_LEVELS = {
  '1': 'A2',
  '2': 'B1', 
  '3': 'B2',
  '4': 'C1'
};

export default function ReadingMultiStepCreator({ onSuccess }: ReadingMultiStepCreatorProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepData, setStepData] = useState<StepData>({
    part: '1',
    generationType: 'new',
    topic: '',
    level: 'A2',
    generatedQuestions: [],
    passageText: '',
    passages: [],
    title: '',
    textGenerated: false,
    finalReview: false,
  });

  const updateStepData = (updates: Partial<StepData>) => {
    setStepData(prev => ({ ...prev, ...updates }));
  };

  const handleStepComplete = (data: Partial<StepData>) => {
    updateStepData(data);
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinalSave = async () => {
    try {
      console.log('🔍 Starting handleFinalSave');
      console.log('📊 Current stepData:', stepData);

      // Transform data back to backend expected format
      let questionsForBackend = stepData.generatedQuestions;
      let passageTextForBackend = stepData.passageText;
      
      // For Reading Part 2, convert questions[0].sentences back to backend format
      if (stepData.part === '2' && stepData.generatedQuestions[0]?.sentences) {
        // Backend expects questions array to be empty for Part 2
        questionsForBackend = [];
        // Backend expects passageText as JSON string of sentences array
        passageTextForBackend = JSON.stringify(stepData.generatedQuestions[0].sentences);
      }

      // Ensure we have all required fields
      const title = stepData.title || `Reading Part ${stepData.part} - AI Generated`;
      const part = parseInt(stepData.part);
      const type = 'reading';
      const level = stepData.level;

      // Create the final question set in backend expected format
      const questionSetData = {
        title,
        description: `AI generated ${type} questions for part ${part}`,
        type,
        part,
        level,
        questions: questionsForBackend || [],
        passageText: passageTextForBackend,
        passages: stepData.passages || [],
      };

      console.log('📋 Question set data to send:', questionSetData);

      // Validate required fields
      if (!title.trim()) {
        throw new Error('Title is required');
      }
      if (!part || isNaN(part)) {
        throw new Error('Valid part number is required');
      }
      if (!type) {
        throw new Error('Type is required');
      }

      // Save to backend
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetchWithAuth(`${API_BASE_URL}/ai-questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(questionSetData)
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Save error response:', errorData);
        throw new Error(errorData.details || errorData.error || 'Failed to save question set');
      }

      const savedQuestionSet = await response.json();
      console.log('✅ Successfully saved:', savedQuestionSet);
      
      onSuccess([savedQuestionSet.data || savedQuestionSet]);

      // Reset form
      setCurrentStep(1);
      setStepData({
        part: '1',
        generationType: 'new',
        topic: '',
        level: 'A2',
        generatedQuestions: [],
        passageText: '',
        passages: [],
        title: '',
        textGenerated: false,
        finalReview: false,
      });

      alert('Question set saved successfully!');

    } catch (error: any) {
      console.error('❌ Error saving question set:', error);
      alert(`Failed to save question set: ${error.message}`);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepOneTextGeneration
            stepData={stepData}
            updateStepData={updateStepData}
            onComplete={handleStepComplete}
          />
        );
      case 2:
        return (
          <StepTwoPreviewEdit
            stepData={stepData}
            updateStepData={updateStepData}
            onSave={handleFinalSave}
            onCancel={handlePrevious}
          />
        );
      default:
        return null;
    }
  };

  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'upcoming';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Wand2 className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Reading Question Creator</h2>
          <p className="text-gray-600">Generate APTIS reading tests with advanced AI technology</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => {
          const status = getStepStatus(step.id);
          const StepIcon = step.icon;
          
          return (
            <div key={step.id} className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 
                  ${status === 'completed' 
                    ? 'bg-green-100 border-green-500 text-green-600' 
                    : status === 'current'
                    ? 'bg-blue-100 border-blue-500 text-blue-600'
                    : 'bg-gray-100 border-gray-300 text-gray-400'
                  }
                `}>
                  {status === 'completed' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <StepIcon className="w-5 h-5" />
                  )}
                </div>
                <div className="hidden sm:block">
                  <p className={`text-sm font-medium ${
                    status === 'current' ? 'text-blue-600' : 
                    status === 'completed' ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
              </div>
              
              {index < STEPS.length - 1 && (
                <ChevronRight className="w-5 h-5 text-gray-400 mx-4" />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </Button>

        <Button
          onClick={handleNext}
          disabled={currentStep === 1 && !stepData.textGenerated || currentStep === STEPS.length}
          className="flex items-center space-x-2"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
