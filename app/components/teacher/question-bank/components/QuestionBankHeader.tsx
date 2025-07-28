'use client';

import { Button } from '@/app/components/ui/basic';
import { PlusCircle } from "lucide-react";

interface QuestionBankHeaderProps {
  onNewQuestionSet: () => void;
}

const QuestionBankHeader = ({ onNewQuestionSet }: QuestionBankHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-gray-900">Question Bank</h1>
      <Button 
        variant="outline"
        onClick={onNewQuestionSet}
        className="whitespace-nowrap flex items-center gap-2"
      >
        <PlusCircle className="w-5 h-5" />
        New Question Set
      </Button>
    </div>
  );
};

export default QuestionBankHeader;
