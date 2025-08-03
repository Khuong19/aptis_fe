'use client';

import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Label,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Textarea,
  Alert,
  AlertDescription,
} from '@/app/components/ui/basic';
import { Loader2, Wand2, AlertCircle, CheckCircle } from 'lucide-react';
import { StepData } from './index';
import ApiKeyInput from '../../components/ApiKeyInput';
import { useApiKeys } from '@/app/hooks/useApiKeys';
import { fetchWithAuth } from '@/app/lib/auth/apiInterceptor';

interface StepOneTextGenerationProps {
  stepData: StepData;
  updateStepData: (updates: Partial<StepData>) => void;
  onComplete: (data: Partial<StepData>) => void;
}

export default function StepOneTextGeneration({
  stepData,
  updateStepData,
  onComplete,
}: StepOneTextGenerationProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { hasValidApiKeys } = useApiKeys();

  const handleGenerateText = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if API keys are configured
    if (!hasValidApiKeys()) {
      setError('Please configure your API keys before generating questions');
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    setSuccess(false);

    try {
      const requestData = {
        part: stepData.part,
        generationType: stepData.generationType,
        ...(stepData.generationType === 'new' && { topic: stepData.topic }),
      };
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const response = await fetchWithAuth(`${API_BASE_URL}/ai/test-listening-generation`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(requestData),
            });

      if (!response.ok) {
        throw new Error(`Failed to generate questions: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        const generatedSet = result.data;
        
        // Debug logging
        console.log('StepOneTextGeneration - API response:', result);
        console.log('StepOneTextGeneration - generatedSet:', generatedSet);
        
        const updatedData: Partial<StepData> = {
          generatedQuestions: generatedSet.questions || [],
          questions: generatedSet.questions || [], // Also map to questions field for compatibility
          passageText: generatedSet.passageText || '',
          passages: generatedSet.passages || [],
          passageTitle: generatedSet.title || '',
          conversations: generatedSet.conversations || [],
          monologue: generatedSet.monologue || null,
          speakers: generatedSet.speakers || [],
          discussion: generatedSet.discussion || [],
          lectures: generatedSet.lectures || [],
          textGenerated: true,
        };
        
        console.log('StepOneTextGeneration - updatedData:', updatedData);
        
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
    updateStepData({ [field]: value });
  };

  return (
    <CardContent className="p-6">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Wand2 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Step 1: Generate Question Text</h3>
            <p className="text-sm text-gray-600">
              Use AI to generate listening questions and passage text
            </p>
          </div>
        </div>

        {/* API Keys Configuration */}
        <ApiKeyInput compact={true} />

        <form onSubmit={handleGenerateText} className="space-y-6">
          {/* Basic Configuration */}
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
                <SelectItem value={1}>Part 1 - Conversations</SelectItem>
                <SelectItem value={2}>Part 2 - Monologue</SelectItem>
                <SelectItem value={3}>Part 3 - Discussion</SelectItem>
                <SelectItem value={4}>Part 4 - Lectures</SelectItem>
              </SelectContent>
            </Select>
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
                placeholder="Enter a topic for new questions (e.g., 'Technology in Education')"
                required
              />
              <p className="text-sm text-gray-500">
                Be specific about the topic to get better results
              </p>
            </div>
          )}

          {/* Paraphrase Mode Info */}
          {stepData.generationType === 'paraphrase' && (
            <div className="space-y-2">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-700">
                  Paraphrase mode will generate questions based on official APTIS test patterns and structures,
                  creating content that follows the same format but with different topics and contexts.
                </p>
              </div>
            </div>
          )}


          {/* Additional Instructions */}
          <div className="space-y-2">
            <Label htmlFor="instructions">Additional Instructions (Optional)</Label>
            <Textarea
              id="instructions"
              placeholder="Any specific instructions for the AI generator..."
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Success Display */}
          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Text generation completed successfully! You can now proceed to the next step.
              </AlertDescription>
            </Alert>
          )}

          {/* Generate Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={isGenerating || !hasValidApiKeys()}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Text...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate Listening Questions
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Preview of Generated Content */}
        {stepData.textGenerated && stepData.generatedQuestions.length > 0 && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>Generated Content Preview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-green-800">Questions Generated:</h4>
                  <p className="text-sm text-green-700">
                    {stepData.generatedQuestions.length} questions created for Part {stepData.part}
                  </p>
                </div>
                
                {stepData.passageTitle && (
                  <div>
                    <h4 className="font-medium text-green-800">Title:</h4>
                    <p className="text-sm text-green-700">{stepData.passageTitle}</p>
                  </div>
                )}
                
                {stepData.passageText && (
                  <div>
                    <h4 className="font-medium text-green-800">Passage Text:</h4>
                    <p className="text-sm text-green-700 line-clamp-3">
                      {stepData.passageText.substring(0, 200)}...
                    </p>
                  </div>
                )}
                
                <div className="text-sm text-green-600 font-medium">
                  ✓ Ready to proceed to Step 2: Review & Edit
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </CardContent>
  );
}