'use client';

import { useState } from 'react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/app/components/ui/basic';
import { FileCheck, Sparkles } from "lucide-react";
import OfficialQuestionUploadForm from './OfficialQuestionUpload';
import ReadingMultiStepCreator from './ReadingMultiStepCreator';
import { QuestionSet } from '@/app/types/question-bank';

interface QuestionSetCreationTabsProps {
  onSuccess: (newSets: QuestionSet[]) => void;
}

export default function QuestionSetCreationTabs({ onSuccess }: QuestionSetCreationTabsProps) {
  const [activeTab, setActiveTab] = useState<string>('official');

  return (
    <Tabs defaultValue="official" className="w-full" onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-2 mb-6">
        <TabsTrigger value="official" className="flex items-center justify-center gap-2">
          <FileCheck className="h-4 w-4" />
          <span>Official Questions</span>
        </TabsTrigger>
        <TabsTrigger value="ai-generated" className="flex items-center justify-center gap-2">
          <Sparkles className="h-4 w-4" />
          <span>AI Generated</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="official" className="space-y-4">
        <OfficialQuestionUploadForm onSuccess={onSuccess} />
      </TabsContent>
      
      <TabsContent value="ai-generated" className="space-y-4">
        <ReadingMultiStepCreator 
          onSuccess={onSuccess}
        />
      </TabsContent>
    </Tabs>
  );
}
