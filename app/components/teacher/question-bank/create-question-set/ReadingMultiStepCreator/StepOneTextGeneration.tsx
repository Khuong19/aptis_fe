'use client';

import React, { useState, useEffect } from 'react';
import {
  Button,
  Label,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Textarea,
} from '@/app/components/ui/basic';
import { Loader2, Wand2, AlertCircle, CheckCircle } from 'lucide-react';
import { StepData } from './index';
import { fetchWithAuth } from '@/app/lib/auth/apiInterceptor';
import ApiKeyInput from '../../../listening-question-bank/components/ApiKeyInput';

interface StepOneTextGenerationProps {
  stepData: StepData;
  updateStepData: (updates: Partial<StepData>) => void;
  onComplete: (data: Partial<StepData>) => void;
}

const PART_LEVELS = {
  '1': 'A2',
  '2': 'B1', 
  '3': 'B2',
  '4': 'C1'
};

const PART_QUESTION_COUNTS = {
  '1': 5,
  '2': 5,
  '3': 7,
  '4': 7
};

export default function StepOneTextGeneration({
  stepData,
  updateStepData,
  onComplete,
}: StepOneTextGenerationProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isLoadingApiKey, setIsLoadingApiKey] = useState(true);
  const [isSavingApiKey, setIsSavingApiKey] = useState(false);

  // Load user's API key on component mount
  useEffect(() => {
    loadUserApiKey();
  }, []);

  const loadUserApiKey = async () => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetchWithAuth(`${API_BASE_URL}/auth/user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.user?.apiKey) {
          setApiKey(result.user.apiKey);
        }
      }
    } catch (err) {
      console.error('Failed to load API key:', err);
    } finally {
      setIsLoadingApiKey(false);
    }
  };

  const saveUserApiKey = async () => {
    if (!apiKey.trim()) {
      setError('Please enter an API key');
      return;
    }

    setIsSavingApiKey(true);
    setError(null);

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetchWithAuth(`${API_BASE_URL}/users/api-key`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ apiKey: apiKey.trim() })
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error(result.error || 'Failed to save API key');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save API key');
    } finally {
      setIsSavingApiKey(false);
    }
  };

  const handleGenerateText = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsGenerating(true);
    setError(null);
    setSuccess(false);

    try {
      const requestData = {
        type: 'reading',
        part: stepData.part,
        level: stepData.level,
        generationType: stepData.generationType,
        ...(stepData.generationType === 'new' && { topic: stepData.topic }),
        ...(additionalInstructions && { instructions: additionalInstructions }),
        questionCount: PART_QUESTION_COUNTS[stepData.part as keyof typeof PART_QUESTION_COUNTS],
        ...(apiKey.trim() && { userApiKey: apiKey.trim() })
      };

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetchWithAuth(`${API_BASE_URL}/ai-questions/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        const generatedSet = result.data;
        
        // Transform backend format to frontend expected format for Part 2
        let transformedQuestions = generatedSet.questions || [];
        
        // For Reading Part 2, backend returns questions in questions array
        // but we need to check if they have the paragraph field
        if (stepData.part === '2') {
          transformedQuestions = transformedQuestions.map((q: any) => ({
            ...q,
            // Keep paragraph field if it exists, otherwise keep original structure
            paragraph: q.paragraph || q.text || ''
          }));
        }

        const updatedData = {
          generatedQuestions: transformedQuestions,
          passageText: typeof generatedSet.passageText === 'string' ? generatedSet.passageText : '',
          passages: generatedSet.passages || [],
          title: generatedSet.title || `Reading Part ${stepData.part} - ${stepData.level}`,
          textGenerated: true,
        };
        
        updateStepData(updatedData);
        setSuccess(true);
        onComplete(updatedData);
      } else {
        throw new Error(result.error || 'Failed to generate questions');
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate text');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInputChange = (field: keyof StepData, value: any) => {
    const updates: Partial<StepData> = { [field]: value };
    
    // Auto-update level when part changes
    if (field === 'part') {
      updates.level = PART_LEVELS[value as keyof typeof PART_LEVELS];
    }
    
    updateStepData(updates);
  };

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Wand2 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Step 1: Generate Question Text</h3>
            <p className="text-sm text-gray-600">
              Use AI to generate reading questions and passage text
            </p>
          </div>
        </div>

        <form onSubmit={handleGenerateText} className="space-y-6">
          {/* Basic Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="part">Question Part</Label>
              <Select 
                value={stepData.part} 
                onValueChange={(value) => handleInputChange('part', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select part" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Part 1 - Short Texts (A2)</SelectItem>
                  <SelectItem value="2">Part 2 - Longer Text (B1)</SelectItem>
                  <SelectItem value="3">Part 3 - Multiple Texts (B2)</SelectItem>
                  <SelectItem value="4">Part 4 - Academic Text (C1)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Difficulty Level</Label>
              <Input
                id="level"
                value={stepData.level}
                readOnly
                className="bg-gray-50"
                placeholder="Auto-selected based on part"
              />
            </div>
          </div>

          {/* Generation Type */}
          <div className="space-y-2">
            <Label htmlFor="generationType">Generation Type</Label>
            <Select
              value={stepData.generationType}
              onValueChange={(value) => handleInputChange('generationType', value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select generation type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paraphrase">Paraphrase Official Test</SelectItem>
                <SelectItem value="new">Generate New Content</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Topic Input for New Generation */}
          {stepData.generationType === 'new' && (
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                value={stepData.topic}
                onChange={(e) => handleInputChange('topic', e.target.value)}
                placeholder="Enter a topic for new questions (e.g., 'Environmental Conservation')"
                required
              />
              <p className="text-sm text-gray-500">
                Be specific about the topic to get better results. Examples: "Technology in Education", "Climate Change Solutions", "Modern Art Movements"
              </p>
            </div>
          )}

          {/* Paraphrase Mode Info */}
          {stepData.generationType === 'paraphrase' && (
            <div className="space-y-2">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Paraphrase Mode</p>
                    <p className="text-sm text-blue-700 mt-1">
                      This will generate questions based on official APTIS test patterns and structures,
                      creating content that follows the same format but with different topics and contexts.
                      Perfect for creating practice tests that match the official exam style.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Question Count Info */}
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
            <p className="text-sm text-gray-700">
              <strong>Questions to generate:</strong> {PART_QUESTION_COUNTS[stepData.part as keyof typeof PART_QUESTION_COUNTS]} questions
              {stepData.part === '1' && ' (5 short texts with 1 question each)'}
              {stepData.part === '2' && ' (1 longer text with 5 questions)'}
              {stepData.part === '3' && ' (Multiple texts with 7 questions total)'}
              {stepData.part === '4' && ' (1 academic text with 7 questions)'}
            </p>
          </div>

          {/* Additional Instructions */}
          <div className="space-y-2">
            <Label htmlFor="instructions">Additional Instructions (Optional)</Label>
            <Textarea
              id="instructions"
              value={additionalInstructions}
              onChange={(e) => setAdditionalInstructions(e.target.value)}
              placeholder="Any specific instructions for the AI generator (e.g., 'Focus on vocabulary about business', 'Include more inference questions')..."
              rows={3}
              className="resize-none"
            />
          </div>

          {/* API Key Section */}
          <div className="space-y-2">
            <Label htmlFor="apiKey">AI API Key</Label>
            <div className="flex gap-2">
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Google Gemini API key"
                disabled={isLoadingApiKey}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={saveUserApiKey}
                disabled={isSavingApiKey || isLoadingApiKey || !apiKey.trim()}
                className={`whitespace-nowrap${isSavingApiKey || isLoadingApiKey || !apiKey.trim() ? ' opacity-60 cursor-not-allowed' : ''}`}
                variant="outline"
              >
                {isSavingApiKey ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Key'
                )}
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              Enter your Google Gemini API key to use AI question generation. Your key will be saved securely and can be updated anytime.
              {!apiKey && (
                <span className="text-amber-600 font-medium"> A valid API key is required for AI generation.</span>
              )}
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Success Display */}
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <p className="text-sm text-green-800">
                  Text generation completed successfully! You can now proceed to the next step to review and edit the generated content.
                </p>
              </div>
            </div>
          )}

          {/* Generate Button */}
          <Button
            type="submit"
            disabled={isGenerating || (stepData.generationType === 'new' && !stepData.topic.trim()) || !apiKey.trim()}
            className={`w-full bg-blue-600 hover:bg-blue-700${isGenerating || (stepData.generationType === 'new' && !stepData.topic.trim()) || !apiKey.trim() ? ' opacity-60 cursor-not-allowed' : ''}`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Questions...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Generate Reading Questions
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
