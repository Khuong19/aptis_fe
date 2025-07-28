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
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/app/components/ui/basic';
import { 
  Eye, 
  CheckCircle, 
  AlertCircle, 
  Save, 
  Play, 
  Pause,
  Download,
  Volume2,
  FileText,
  Clock
} from 'lucide-react';
import { StepData } from './index';
import { QuestionSet } from '@/app/types/question-bank';
import ListeningPart1 from '../shared/ListeningPart1';
import ListeningPart2 from '../shared/ListeningPart2';
import ListeningPart3 from '../shared/ListeningPart3';
import ListeningPart4 from '../shared/ListeningPart4';

interface StepFourFinalPreviewProps {
  stepData: StepData;
  updateStepData: (updates: Partial<StepData>) => void;
  onComplete: (data: Partial<StepData>) => void;
  onSuccess: (generatedSets: QuestionSet[]) => void;
}

export default function StepFourFinalPreview({
  stepData,
  updateStepData,
  onComplete,
  onSuccess,
}: StepFourFinalPreviewProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('content');

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
    audioFiles: stepData.audioFiles,
  };

  const handleSaveToQuestionBank = async () => {
    setIsSaving(true);
    
    try {
      // Create question set object
      const questionSet: QuestionSet = {
        id: `listening-${Date.now()}`,
        title: stepData.passageTitle || `Listening Part ${stepData.part} Questions`,
        part: parseInt(stepData.part),
        level: 'B1', // Default level for AI-generated content
        type: 'listening',
        source: 'ai-generated',
        questions: stepData.generatedQuestions,
        authorId: 'current-user', // TODO: Get from auth context
        authorName: 'Current User', // TODO: Get from auth context
        passageText: stepData.passageText,
        passages: stepData.passages,
        conversations: stepData.conversations,
        monologue: stepData.monologue,
        speakers: stepData.speakers,
        discussion: stepData.discussion,
        lectures: stepData.lectures,
        audioFiles: stepData.audioFiles,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublic: false,
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const updatedData: Partial<StepData> = {
        finalPreviewCompleted: true,
      };
      
      updateStepData(updatedData);
      onComplete(updatedData);
      onSuccess([questionSet]);
      
    } catch (error) {
      console.error('Failed to save question set:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const calculateEstimatedDuration = (): number => {
    // Estimate based on content length and number of questions
    const baseTime = stepData.part === '1' ? 3 : stepData.part === '2' ? 5 : stepData.part === '3' ? 4 : 6;
    const questionTime = stepData.generatedQuestions.length * 0.5;
    const audioTime = stepData.audioFiles.length * 1.5;
    return Math.ceil(baseTime + questionTime + audioTime);
  };

  const renderPartContent = () => {
    const part = stepData.part;
    
    switch (part) {
      case '1':
        return <ListeningPart1 previewData={previewData} onEdit={() => {}} />;
      case '2':
        return <ListeningPart2 previewData={previewData} onEdit={() => {}} />;
      case '3':
        return <ListeningPart3 previewData={previewData} onEdit={() => {}} />;
      case '4':
        return <ListeningPart4 previewData={previewData} onEdit={() => {}} />;
      default:
        return null;
    }
  };

  if (!stepData.audioGenerated) {
    return (
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <div className="p-4 bg-amber-50 rounded-lg">
            <AlertCircle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
            <h3 className="font-medium text-amber-800">Audio Generation Required</h3>
            <p className="text-sm text-amber-700">
              Please complete Step 3 (Generate Audio) before proceeding to final preview.
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
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Eye className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Step 4: Final Preview</h3>
              <p className="text-sm text-gray-600">
                Review the complete listening question set with audio
              </p>
            </div>
          </div>
          
          <Button
            onClick={handleSaveToQuestionBank}
            disabled={isSaving}
            className="bg-emerald-600 hover:bg-emerald-700 flex items-center space-x-2"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save to Question Bank</span>
              </>
            )}
          </Button>
        </div>

        {/* Summary Card */}
        <Card className="border-emerald-200 bg-emerald-50">
          <CardHeader>
            <CardTitle className="text-emerald-800 flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Question Set Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-sm text-emerald-700">Part & Level</p>
                  <p className="font-medium text-emerald-800">Part {stepData.part} - B1</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-sm text-emerald-700">Questions</p>
                  <p className="font-medium text-emerald-800">{stepData.generatedQuestions.length} items</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Volume2 className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-sm text-emerald-700">Audio Files</p>
                  <p className="font-medium text-emerald-800">{stepData.audioFiles.length} files</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-sm text-emerald-700">Est. Duration</p>
                  <p className="font-medium text-emerald-800">{calculateEstimatedDuration()} min</p>
                </div>
              </div>
            </div>
            
            {stepData.passageTitle && (
              <div className="mt-4 p-3 bg-white rounded-md border border-emerald-200">
                <p className="text-sm text-emerald-700 font-medium">Title:</p>
                <p className="text-emerald-800">{stepData.passageTitle}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Content Preview */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Content Preview</TabsTrigger>
            <TabsTrigger value="audio">Audio Files</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Complete Question Set</CardTitle>
              </CardHeader>
              <CardContent>
                {renderPartContent()}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audio" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Generated Audio Files</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stepData.audioFiles.map((audioUrl, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Audio {index + 1}</p>
                        <p className="text-sm text-gray-600">
                          {stepData.part === '1' ? `Conversation ${index + 1}` :
                           stepData.part === '2' ? 'Monologue' :
                           stepData.part === '3' ? `Speaker ${index + 1}` :
                           `Lecture ${index + 1}`}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const audio = new Audio(audioUrl);
                            audio.play();
                          }}
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(audioUrl, '_blank')}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metadata" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Question Set Metadata</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Type</Label>
                      <p className="text-sm">Listening</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Source</Label>
                      <p className="text-sm">AI-Generated</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Generation Type</Label>
                      <p className="text-sm capitalize">{stepData.generationType}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Topic</Label>
                      <p className="text-sm">{stepData.topic || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Tags</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge variant="outline">part-{stepData.part}</Badge>
                      <Badge variant="outline">B1</Badge>
                      <Badge variant="outline">listening</Badge>
                      <Badge variant="outline">ai-generated</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Voice Preferences</Label>
                    <div className="text-sm text-gray-600 mt-1">
                      {Object.entries(stepData.voicePreferences).length > 0 ? (
                        Object.entries(stepData.voicePreferences).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span>{key}:</span>
                            <span>{value || 'Auto'}</span>
                          </div>
                        ))
                      ) : (
                        'All voices set to Auto'
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Final Status */}
        <Alert className="border-emerald-200 bg-emerald-50">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <AlertDescription className="text-emerald-800">
            <div className="space-y-2">
              <p className="font-medium">Question Set Ready!</p>
              <p className="text-sm">
                Your listening question set is complete with {stepData.generatedQuestions.length} questions 
                and {stepData.audioFiles.length} audio files. Click "Save to Question Bank" to add it to your collection.
              </p>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    </CardContent>
  );
}

function Label({ className, children }: { className?: string; children: React.ReactNode }) {
  return <label className={className}>{children}</label>;
}