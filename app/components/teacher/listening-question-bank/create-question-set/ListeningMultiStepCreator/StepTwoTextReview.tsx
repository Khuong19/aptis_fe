'use client';

import React, { useState, useEffect } from 'react';
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
import { Edit3, CheckCircle, AlertCircle, Save, RotateCcw, X } from 'lucide-react';
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
  
  // Edit states for segments and questions
  const [editingSegments, setEditingSegments] = useState(false);
  const [editingQuestions, setEditingQuestions] = useState(false);
  const [editedSegments, setEditedSegments] = useState<any[]>([]);
  const [editedQuestions, setEditedQuestions] = useState<any[]>([]);

  // Debug logging to see actual data structure
  console.log('StepTwoTextReview - stepData:', stepData);
  console.log('StepTwoTextReview - monologue:', stepData.monologue);
  console.log('StepTwoTextReview - questions:', stepData.questions);
  console.log('StepTwoTextReview - generatedQuestions:', stepData.generatedQuestions);

  // Transform data to match the expected type for ListeningPart components
  const transformPreviewData = (data: typeof stepData) => {
    // Create a new object with only the properties we need
    const baseData: any = {
      title: data.passageTitle || `Listening Part ${data.part}`,
      description: `Listening Part ${data.part} exercise`,
      type: 'listening',
      part: data.part,
      level: 'B1', // Default to B1 level
      conversations: Array.isArray(data.conversations) ? data.conversations : [],
      audioFiles: (data as any).audioFiles || [],
      passageText: data.passageText || '',
      // Map the actual data from API response
      monologue: data.monologue || null,
      speakers: data.speakers || [],
      discussion: data.discussion || [],
      lectures: data.lectures || [],
      questions: data.generatedQuestions || [],
    };

    // For part 1, ensure we have at least one conversation with a question
    if (data.part === 1 && baseData.conversations.length === 0 && data.generatedQuestions.length > 0) {
      const firstQuestion = data.generatedQuestions[0];
      baseData.conversations = [{
        id: 'conv-1',
        title: 'Conversation',
        context: 'General conversation',
        difficulty: 'B1',
        segments: [],
        question: {
          id: 'q-1',
          text: firstQuestion?.text || 'Listen to the conversation and answer the question.',
          options: {
            A: Array.isArray(firstQuestion?.options) && firstQuestion.options[0] ? String(firstQuestion.options[0]) : 'Option A',
            B: Array.isArray(firstQuestion?.options) && firstQuestion.options[1] ? String(firstQuestion.options[1]) : 'Option B',
            C: Array.isArray(firstQuestion?.options) && firstQuestion.options[2] ? String(firstQuestion.options[2]) : 'Option C'
          },
          answer: firstQuestion?.answer ? String(firstQuestion.answer) : 'A'
        }
      }];
    }

    return baseData;
  };

  // Prepare preview data for the listening components
  const previewData = transformPreviewData(stepData);
  
  // Debug logging for preview data
  console.log('StepTwoTextReview - previewData after transform:', previewData);

  const handleEdit = (updatedData: any) => {
    const updates: Partial<StepData> = {};
    let hasActualChanges = false;
    
    // Update conversations if they were changed
    if (updatedData.conversations) {
      updates.conversations = updatedData.conversations;
      hasActualChanges = true;
      
      // If we have questions in the first conversation, update the generatedQuestions
      if (updatedData.conversations.length > 0 && updatedData.conversations[0].question) {
        const question = updatedData.conversations[0].question;
        updates.generatedQuestions = [{
          text: question.text,
          options: Object.values(question.options),
          answer: question.answer,
          type: 'multiple_choice'
        }];
      }
    }
    
    // Update passage text if it was changed
    if (updatedData.passageText && updatedData.passageText !== stepData.passageText) {
      updates.passageText = updatedData.passageText;
      hasActualChanges = true;
    }
    
    // Update title if it was changed
    if (updatedData.title && updatedData.title !== stepData.passageTitle) {
      updates.passageTitle = updatedData.title;
      hasActualChanges = true;
    }
    
    // Update monologue if it was changed
    if (updatedData.monologue) {
      updates.monologue = updatedData.monologue;
      hasActualChanges = true;
    }
    
    // Update questions if they were changed
    if (updatedData.questions) {
      updates.questions = updatedData.questions;
      updates.generatedQuestions = updatedData.questions;
      hasActualChanges = true;
    }
    
    // Update level if it was changed (store in a custom field if needed)
    if (updatedData.level && updatedData.level !== (stepData as any).level) {
      // Store level in a custom field if needed
      // updates.customLevel = updatedData.level;
    }
    
    // Update other part-specific data if needed
    if (Object.keys(updates).length > 0) {
      updateStepData(updates);
    }
    
    // Only set hasChanges if there are actual changes
    if (hasActualChanges) {
      setHasChanges(true);
    }
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

  // Function to check if there are actual changes and reset hasChanges if needed
  const checkAndResetChanges = () => {
    // Check if there are any actual changes in the data
    const hasActualChanges = false; // This would need to be implemented based on your specific logic
    
    if (!hasActualChanges) {
      setHasChanges(false);
    }
  };

  // Effect to monitor changes and reset hasChanges when appropriate
  useEffect(() => {
    // Reset hasChanges when entering edit mode without making changes
    if (!editingSegments && !editingQuestions && hasChanges) {
      // Check if there are actual changes by comparing current data with original
      // For now, we'll keep it simple and let the user manually save
      console.log('Edit mode exited, checking for actual changes...');
    }
  }, [editingSegments, editingQuestions, hasChanges]);

  const handleResetChanges = () => {
    // Reset to original generated content
    setHasChanges(false);
    setEditingSegments(false);
    setEditingQuestions(false);
    setEditedSegments([]);
    setEditedQuestions([]);
    // Note: In a real implementation, you'd restore from backup
  };

  // Handle editing segments
  const handleStartEditingSegments = () => {
    const currentSegments = stepData.monologue?.segments || [];
    setEditedSegments([...currentSegments]);
    setEditingSegments(true);
    setActiveTab('detailed'); // Switch to detailed tab when editing
  };

  const handleSaveSegments = () => {
    if (stepData.monologue) {
      // Check if there are actual changes
      const originalSegments = stepData.monologue.segments || [];
      const hasActualChanges = JSON.stringify(originalSegments) !== JSON.stringify(editedSegments);
      
      if (hasActualChanges) {
        const updatedMonologue = {
          ...stepData.monologue,
          segments: editedSegments
        };
        updateStepData({ monologue: updatedMonologue });
        setHasChanges(true);
      } else {
        // No actual changes, don't set hasChanges to true
        console.log('No changes detected in segments');
        // You could add a toast notification here if you have a toast system
      }
    }
    setEditingSegments(false);
  };

  const handleCancelEditingSegments = () => {
    setEditingSegments(false);
    setEditedSegments([]);
  };

  const handleUpdateSegment = (index: number, field: string, value: string) => {
    const updatedSegments = [...editedSegments];
    updatedSegments[index] = {
      ...updatedSegments[index],
      [field]: value
    };
    setEditedSegments(updatedSegments);
  };

  const handleAddSegment = () => {
    const newSegment = {
      id: `seg-${Date.now()}`,
      text: '',
      speaker: `Person ${editedSegments.length + 1}`,
      order: editedSegments.length + 1
    };
    setEditedSegments([...editedSegments, newSegment]);
  };

  const handleRemoveSegment = (index: number) => {
    const updatedSegments = editedSegments.filter((_, i) => i !== index);
    setEditedSegments(updatedSegments);
  };

  // Handle editing questions
  const handleStartEditingQuestions = () => {
    const currentQuestions = stepData.questions || stepData.generatedQuestions || [];
    setEditedQuestions([...currentQuestions]);
    setEditingQuestions(true);
    setActiveTab('detailed'); // Switch to detailed tab when editing
  };

  const handleSaveQuestions = () => {
    // Check if there are actual changes
    const originalQuestions = stepData.questions || stepData.generatedQuestions || [];
    const hasActualChanges = JSON.stringify(originalQuestions) !== JSON.stringify(editedQuestions);
    
    if (hasActualChanges) {
      updateStepData({ 
        questions: editedQuestions,
        generatedQuestions: editedQuestions 
      });
      setHasChanges(true);
    } else {
      // No actual changes, don't set hasChanges to true
      console.log('No changes detected in questions');
      // You could add a toast notification here if you have a toast system
    }
    setEditingQuestions(false);
  };

  const handleCancelEditingQuestions = () => {
    setEditingQuestions(false);
    setEditedQuestions([]);
  };

  const handleUpdateQuestion = (index: number, field: string, value: string) => {
    const updatedQuestions = [...editedQuestions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    };
    setEditedQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      id: `q-${Date.now()}`,
      text: '',
      sentence: '',
      answer: '',
      position: editedQuestions.length + 1
    };
    setEditedQuestions([...editedQuestions, newQuestion]);
  };

  const handleRemoveQuestion = (index: number) => {
    const updatedQuestions = editedQuestions.filter((_, i) => i !== index);
    setEditedQuestions(updatedQuestions);
  };

  const renderPartContent = () => {
    // Convert part to string for consistent comparison
    const part = String(stepData.part);
    
    const renderListeningComponent = () => {
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

    return (
      <div className="space-y-4">
        {/* Edit Buttons Header */}
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Listening Content</h3>
            <p className="text-sm text-gray-600">Review and edit the generated listening content</p>
          </div>
          <div className="flex items-center space-x-2">
            {stepData.monologue?.segments && stepData.monologue.segments.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleStartEditingSegments}
                className="flex items-center space-x-1"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Segments</span>
              </Button>
            )}
            {(stepData.questions?.length > 0 || stepData.generatedQuestions?.length > 0) && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleStartEditingQuestions}
                className="flex items-center space-x-1"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Questions</span>
              </Button>
            )}
          </div>
        </div>

        {/* Listening Component */}
        {renderListeningComponent()}
      </div>
    );
  };

  // Check for content based on the listening part type
  const hasContent = (() => {
    const part = String(stepData.part);
    console.log('part', typeof part);
    switch (part) {
      case '1':
        return Array.isArray(stepData.conversations) && stepData.conversations.length > 0;
      case '2':
        return stepData.monologue !== undefined && 
               stepData.monologue !== null &&
               stepData.monologue.segments && 
               stepData.monologue.segments.length > 0;
      case '3':
        return Array.isArray(stepData.discussion) && stepData.discussion.length > 0;
      case '4':
        return Array.isArray(stepData.lectures) && 
               stepData.lectures.length > 0 &&
               stepData.lectures[0]?.questions?.length > 0;
      default:
        return false;
    }
  })();
  
  if (!hasContent) {
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
                    <p className="text-sm text-gray-600">
                      {stepData.generatedQuestions?.length || stepData.questions?.length || 0} questions generated
                    </p>
                  </div>
                  
                  {stepData.monologue?.segments && (
                    <div>
                      <h4 className="font-medium text-gray-900">Segments</h4>
                      <p className="text-sm text-gray-600">
                        {stepData.monologue.segments.length} listening segments
                      </p>
                    </div>
                  )}
                  
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
            {/* Show original ListeningPart components when not editing */}
            {!editingSegments && !editingQuestions && renderPartContent()}
            
            {/* Show Segments Editor when editing segments */}
            {editingSegments && stepData.monologue?.segments && stepData.monologue.segments.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Edit Listening Segments</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        onClick={handleSaveSegments}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Save Changes
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelEditingSegments}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {editedSegments.map((segment: any, idx: number) => (
                      <div key={segment.id || idx} className="bg-gray-50 p-4 rounded-md">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-700">Segment {idx + 1}</h4>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRemoveSegment(idx)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Speaker
                            </label>
                            <input
                              type="text"
                              value={segment.speaker || `Person ${idx + 1}`}
                              onChange={(e) => handleUpdateSegment(idx, 'speaker', e.target.value)}
                              className="w-full p-2 border rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Text
                            </label>
                            <textarea
                              value={segment.text || ''}
                              onChange={(e) => handleUpdateSegment(idx, 'text', e.target.value)}
                              className="w-full p-2 border rounded-md h-24 resize-none"
                              placeholder="Enter segment text..."
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="flex justify-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleAddSegment}
                        className="border-dashed border-2 border-gray-300 hover:border-gray-400"
                      >
                        + Add Segment
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Show Questions Editor when editing questions */}
            {editingQuestions && (stepData.questions?.length > 0 || stepData.generatedQuestions?.length > 0) && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Edit Questions</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        onClick={handleSaveQuestions}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Save Changes
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelEditingQuestions}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {editedQuestions.map((question: any, idx: number) => (
                      <div key={question.id || idx} className="bg-gray-50 p-4 rounded-md">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-700">Question {idx + 1}</h4>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRemoveQuestion(idx)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Question Text
                            </label>
                            <input
                              type="text"
                              value={question.text || question.sentence || ''}
                              onChange={(e) => handleUpdateQuestion(idx, 'text', e.target.value)}
                              className="w-full p-2 border rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Sentence/Answer Text
                            </label>
                            <input
                              type="text"
                              value={question.sentence || ''}
                              onChange={(e) => handleUpdateQuestion(idx, 'sentence', e.target.value)}
                              className="w-full p-2 border rounded-md"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Answer (A, B, C, etc.)
                              </label>
                              <input
                                type="text"
                                value={question.answer || ''}
                                onChange={(e) => handleUpdateQuestion(idx, 'answer', e.target.value)}
                                className="w-full p-2 border rounded-md"
                                placeholder="A"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Position
                              </label>
                              <input
                                type="number"
                                value={question.position || idx + 1}
                                onChange={(e) => handleUpdateQuestion(idx, 'position', e.target.value)}
                                className="w-full p-2 border rounded-md"
                                min="1"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="flex justify-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleAddQuestion}
                        className="border-dashed border-2 border-gray-300 hover:border-gray-400"
                      >
                        + Add Question
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
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

        {/* Edit Mode Instructions */}
        {(editingSegments || editingQuestions) && (
          <Alert className="border-blue-200 bg-blue-50">
            <Edit3 className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              {editingSegments 
                ? "You are now editing listening segments. Make your changes and click 'Save Changes' when done."
                : "You are now editing questions. Make your changes and click 'Save Changes' when done."
              }
            </AlertDescription>
          </Alert>
        )}
      </div>
    </CardContent>
  );
}