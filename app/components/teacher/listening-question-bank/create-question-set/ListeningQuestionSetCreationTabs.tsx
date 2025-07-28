'use client';

import { useState } from 'react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/app/components/ui/basic';
import { FileCheck, Layers } from "lucide-react";
import ListeningOfficialQuestionUploadForm from './ListeningOfficialQuestionUpload';
import ListeningMultiStepCreator from './ListeningMultiStepCreator';
import { QuestionSet } from '@/app/types/question-bank';

interface ListeningQuestionSetCreationTabsProps {
  onSuccess: (newSets: QuestionSet[]) => void;
}

export default function ListeningQuestionSetCreationTabs({ onSuccess }: ListeningQuestionSetCreationTabsProps) {
  const [activeTab, setActiveTab] = useState<string>('multistep');

  return (
    <Tabs defaultValue="multistep" className="w-full" onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-2 mb-6">
        <TabsTrigger value="multistep" className="flex items-center justify-center gap-2">
          <Layers className="h-4 w-4" />
          <span>Multi-Step Creator</span>
        </TabsTrigger>
        <TabsTrigger value="official" className="flex items-center justify-center gap-2">
          <FileCheck className="h-4 w-4" />
          <span>Official Questions</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="multistep" className="space-y-4">
        <ListeningMultiStepCreator onSuccess={onSuccess} />
      </TabsContent>

      <TabsContent value="official" className="space-y-4">
        <ListeningOfficialQuestionUploadForm onSuccess={onSuccess} />
      </TabsContent>
    </Tabs>
  );
} 