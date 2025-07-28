'use client';

import React, { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Alert,
  AlertDescription,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/app/components/ui/basic';
import { Edit3, CheckCircle, AlertCircle, Save, RotateCcw } from 'lucide-react';
import { StepData } from './index';
import ListeningPart1 from '../shared/ListeningPart1';
import ListeningPart2 from '../shared/ListeningPart2';
import ListeningPart3 from '../shared/ListeningPart3';
import ListeningPart4 from '../shared/ListeningPart4';

interface StepTwoTextReviewProps {
  stepData: StepData;
  updateStepData: (updates: Partial<StepData>) => void;
  onComplete: (data: Partial<StepData>) => void;
}

export default function StepTwoTextReview({
  stepData,
  updateStepData,
  onComplete,
}: StepTwoTextReviewProps) {
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Prepare preview data for the listening components
  const previewData = {
    questions: stepData.generatedQuestions,
    passage: stepData.passageText,
    passageText: stepData.passageText,
    passages: stepData.passages,
    title: stepData.passageTitle,
    part: parseInt(stepData.part),
    conversations: stepData.conversations,
    monologue: stepData.monologue,
    speakers: stepData.speakers,
    discussion: stepData.discussion,
    lectures: stepData.lectures,
  };

  const handleEdit = (updatedData: any) => {
    setHasChanges(true);
    
    const updates: Partial<StepData> = {};
    
    // Update questions if they were changed
    if (updatedData.questions && Array.isArray(updatedData.questions)) {
      updates.generatedQuestions = updatedData.questions;
    }
    
    // Update passage text if it was changed
    if (updatedData.passageText && updatedData.passageText !== stepData.passageText) {
      updates.passageText = updatedData.passageText;
    }
    
    // Update passages if they were changed (for Part 3)
    if (updatedData.passages && JSON.stringify(updatedData.passages) !== JSON.stringify(stepData.passages)) {
      updates.passages = updatedData.passages;
    }
    
    // Update title if it was changed
    if (updatedData.passageTitle && updatedData.passageTitle !== stepData.passageTitle) {
      updates.passageTitle = updatedData.passageTitle;
    }
    
    // Update other part-specific data
    if (updatedData.conversations) updates.conversations = updatedData.conversations;
    if (updatedData.monologue) updates.monologue = updatedData.monologue;
    if (updatedData.speakers) updates.speakers = updatedData.speakers;
    if (updatedData.discussion) updates.discussion = updatedData.discussion;
    if (updatedData.lectures) updates.lectures = updatedData.lectures;
    
    updateStepData(updates);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    
    try {
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedData: Partial<StepData> = {
        textReviewed: true,
      };
      
      updateStepData(updatedData);
      setHasChanges(false);
      
      // Mark step as complete
      onComplete(updatedData);
      
    } catch (error) {
      console.error('Failed to save changes:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetChanges = () => {
    // Reset to original generated content
    setHasChanges(false);
    // Note: In a real implementation, you'd restore from backup
  };

  const renderPartContent = () => {
    const part = stepData.part;
    
    switch (part) {
      case '1':
        return <ListeningPart1 previewData={previewData} onEdit={handleEdit} />;
      case '2':
        return <ListeningPart2 previewData={previewData} onEdit={handleEdit} />;
      case '3':
        return <ListeningPart3 previewData={previewData} onEdit={handleEdit} />;
      case '4':
        return <ListeningPart4 previewData={previewData} onEdit={handleEdit} />;
      default:
        return (
          <div className="text-center p-8 text-gray-500">
            Unknown part: {part}
          </div>
        );
    }
  };

  if (!stepData.textGenerated || stepData.generatedQuestions.length === 0) {
    return (
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <div className="p-4 bg-amber-50 rounded-lg">
            <AlertCircle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
            <h3 className="font-medium text-amber-800">No Text Generated Yet</h3>
            <p className="text-sm text-amber-700">
              Please complete Step 1 to generate text content before proceeding to review.
            </p>
          </div>
        </div>
      </CardContent>
    );
  }

  return (
    <CardContent className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Edit3 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Step 2: Review & Edit Text</h3>
              <p className="text-sm text-gray-600">
                Review the generated content and make any necessary edits
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {hasChanges && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetChanges}
                className="flex items-center space-x-1"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </Button>
            )}
            
            <Button
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="bg-green-600 hover:bg-green-700 flex items-center space-x-2"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Content Overview */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Edit</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Content Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Part Information</h4>
                    <p className="text-sm text-gray-600">Part {stepData.part} - B1</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">Questions</h4>
                    <p className="text-sm text-gray-600">{stepData.generatedQuestions.length} questions generated</p>
                  </div>
                  
                  {stepData.passageTitle && (
                    <div>
                      <h4 className="font-medium text-gray-900">Title</h4>
                      <p className="text-sm text-gray-600">{stepData.passageTitle}</p>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-medium text-gray-900">Status</h4>
                    <div className="flex items-center space-x-2">
                      {hasChanges ? (
                        <span className="text-sm text-amber-600">● Unsaved changes</span>
                      ) : (
                        <span className="text-sm text-green-600">● All changes saved</span>
                      )}
                    </div>
                  </div>
                </div>
                
                {stepData.passageText && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Passage Preview</h4>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm text-gray-700 line-clamp-4">
                        {stepData.passageText}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-4">
            {renderPartContent()}
          </TabsContent>
        </Tabs>

        {/* Status Messages */}
        {hasChanges && (
          <Alert className="border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              You have unsaved changes. Please save your edits before proceeding to the next step.
            </AlertDescription>
          </Alert>
        )}

        {stepData.textReviewed && !hasChanges && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Text review completed successfully! You can now proceed to Step 3: Generate Audio.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </CardContent>
  );
}