'use client';

import React, { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Progress,
} from '@/app/components/ui/basic';
import { 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle, 
  Clock, 
  Wand2,
  Edit3,
  Volume2,
  Eye,
  Save
} from 'lucide-react';
import { QuestionSet } from '@/app/types/question-bank';

// Step components
import StepOneTextGeneration from './StepOneTextGeneration';
import StepTwoTextReview from './StepTwoTextReview';
import StepThreeAudioGeneration from './StepThreeAudioGeneration';
import StepFourFinalPreview from './StepFourFinalPreview';

interface ListeningMultiStepCreatorProps {
  onSuccess: (generatedSets: QuestionSet[]) => void;
}

export interface StepData {
  // Basic configuration
  part: string;
  generationType: 'paraphrase' | 'new';
  topic: string;
  
  // Generated content
  generatedQuestions: any[];
  passageText: string;
  passages: any[];
  passageTitle: string;
  conversations: any[];
  monologue: any;
  speakers: any[];
  discussion: any[];
  lectures: any[];
  
  // Audio data
  audioFiles: string[];
  audioErrors: string[];
  voicePreferences: Record<string, string>;
  
  // Step completion status
  textGenerated: boolean;
  textReviewed: boolean;
  audioGenerated: boolean;
  finalPreviewCompleted: boolean;
}

const STEPS = [
  { id: 1, name: 'Generate Text', icon: Wand2, description: 'Generate listening questions with AI' },
  { id: 2, name: 'Review & Edit', icon: Edit3, description: 'Review and edit generated text' },
  { id: 3, name: 'Generate Audio', icon: Volume2, description: 'Create audio files for text' },
  { id: 4, name: 'Final Preview', icon: Eye, description: 'Preview complete question set' },
];

export default function ListeningMultiStepCreator({ onSuccess }: ListeningMultiStepCreatorProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepData, setStepData] = useState<StepData>({
    part: '1',
    generationType: 'new',
    topic: '',
    generatedQuestions: [],
    passageText: '',
    passages: [],
    passageTitle: '',
    conversations: [],
    monologue: null,
    speakers: [],
    discussion: [],
    lectures: [],
    audioFiles: [],
    audioErrors: [],
    voicePreferences: {},
    textGenerated: false,
    textReviewed: false,
    audioGenerated: false,
    finalPreviewCompleted: false,
  });

  const updateStepData = (updates: Partial<StepData>) => {
    setStepData(prev => ({ ...prev, ...updates }));
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

  const handleStepComplete = (stepNumber: number, data: Partial<StepData>) => {
    updateStepData(data);
    
    // Mark step as completed
    switch (stepNumber) {
      case 1:
        updateStepData({ textGenerated: true });
        break;
      case 2:
        updateStepData({ textReviewed: true });
        break;
      case 3:
        updateStepData({ audioGenerated: true });
        break;
      case 4:
        updateStepData({ finalPreviewCompleted: true });
        break;
    }
    
    // Auto-advance to next step
    if (stepNumber < STEPS.length) {
      setCurrentStep(stepNumber + 1);
    }
  };

  const canProceedToStep = (stepNumber: number): boolean => {
    switch (stepNumber) {
      case 1:
        return true;
      case 2:
        return stepData.textGenerated;
      case 3:
        return stepData.textGenerated && stepData.textReviewed;
      case 4:
        return stepData.textGenerated && stepData.textReviewed && stepData.audioGenerated;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepOneTextGeneration
            stepData={stepData}
            updateStepData={updateStepData}
            onComplete={(data) => handleStepComplete(1, data)}
          />
        );
      case 2:
        return (
          <StepTwoTextReview
            stepData={stepData}
            updateStepData={updateStepData}
            onComplete={(data) => handleStepComplete(2, data)}
          />
        );
      case 3:
        return (
          <StepThreeAudioGeneration
            stepData={stepData}
            updateStepData={updateStepData}
            onComplete={(data) => handleStepComplete(3, data)}
          />
        );
      case 4:
        return (
          <StepFourFinalPreview
            stepData={stepData}
            updateStepData={updateStepData}
            onComplete={(data) => handleStepComplete(4, data)}
            onSuccess={onSuccess}
          />
        );
      default:
        return null;
    }
  };

  const getStepStatus = (stepNumber: number) => {
    if (stepNumber < currentStep) return 'completed';
    if (stepNumber === currentStep) return 'current';
    return 'upcoming';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Progress Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Create Listening Questions
          </h2>
          <Badge variant="outline" className="px-3 py-1">
            Part {stepData.part}
          </Badge>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-6">
          <Progress value={(currentStep / STEPS.length) * 100} className="w-full" />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>Step {currentStep} of {STEPS.length}</span>
            <span>{Math.round((currentStep / STEPS.length) * 100)}% Complete</span>
          </div>
        </div>

        {/* Steps Navigation */}
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            const status = getStepStatus(step.id);
            const isClickable = canProceedToStep(step.id);
            
            return (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => isClickable && setCurrentStep(step.id)}
                  disabled={!isClickable}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    status === 'completed'
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : status === 'current'
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                      : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                  } ${isClickable && status !== 'current' ? 'hover:bg-gray-200' : ''}`}
                >
                  <div className={`p-1 rounded-full ${
                    status === 'completed' ? 'bg-green-200' : 
                    status === 'current' ? 'bg-blue-200' : 'bg-gray-200'
                  }`}>
                    {status === 'completed' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <step.icon className="w-4 h-4" />
                    )}
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{step.name}</div>
                    <div className="text-xs opacity-75">{step.description}</div>
                  </div>
                </button>
                
                {index < STEPS.length - 1 && (
                  <ChevronRight className="w-5 h-5 text-gray-400 mx-2" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-sm border">
        {renderStepContent()}
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center bg-white rounded-lg shadow-sm border p-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </Button>
        
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Step {currentStep} of {STEPS.length}</span>
        </div>
        
        {currentStep < STEPS.length ? (
          <Button
            onClick={handleNext}
            disabled={!canProceedToStep(currentStep + 1)}
            className="flex items-center space-x-2"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={() => onSuccess([])}
            disabled={!stepData.finalPreviewCompleted}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
          >
            <Save className="w-4 h-4" />
            <span>Save Question Set</span>
          </Button>
        )}
      </div>
    </div>
  );
}