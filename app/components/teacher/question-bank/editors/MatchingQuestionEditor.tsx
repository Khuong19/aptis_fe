'use client';

import React from 'react';
import { Passage, Question } from '@/app/types/question-bank';
import { Label, Textarea, Input, Badge } from '@/app/components/ui/basic';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Button } from '@/app/components/ui/basic';
import { PlusCircle, Trash2 } from 'lucide-react';

interface MatchingQuestionEditorProps {
  passages: Passage[];
  questions: Question[];
  onPassageChange: (index: number, text: string) => void;
  onQuestionChange: (index: number, text: string) => void;
    onCorrectPersonChange: (index: number, person: string) => void;
  onAddQuestion: () => void;
  onRemoveQuestion: (index: number) => void;
  readOnly?: boolean;
}

export const MatchingQuestionEditor: React.FC<MatchingQuestionEditorProps> = ({
  passages,
  questions,
  onPassageChange,
  onQuestionChange,
  onCorrectPersonChange,
  onAddQuestion,
  onRemoveQuestion,
  readOnly = false,
}) => {
  const availablePersons = passages.map(p => p.person).filter(p => p);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left side: Passages */}
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Opinions / Passages</h3>
        {passages.map((passage, index) => (
          <div key={passage.id}>
            <Label className="font-semibold">Person {passage.person}</Label>
            {readOnly ? (
              <div className="mt-1 p-3 border rounded-md bg-gray-50 whitespace-pre-wrap min-h-[150px]">
                {passage.text || <span className="text-gray-400">No text provided.</span>}
              </div>
            ) : (
              <Textarea
                id={`passage-${passage.id}`}
                value={passage.text}
                onChange={(e) => onPassageChange(index, e.target.value)}
                placeholder={`Enter text for Person ${passage.person}...`}
                className="min-h-[150px] mt-1"
              />
            )}
          </div>
        ))}
      </div>

      {/* Right side: Questions/Statements */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
            <h3 className="font-medium text-lg">Statements to Match</h3>
            {!readOnly && (
                <Button type="button" variant="outline" size="sm" onClick={onAddQuestion}>
                    <PlusCircle className="w-4 h-4 mr-1" />
                    Add Statement
                </Button>
            )}
        </div>

        <div className="space-y-3">
          {questions.map((question, index) => (
            <div key={question.id} className="flex items-center gap-2 p-2 border rounded-md justify-between">
                <div className="flex items-center gap-2 flex-grow">
                    <Label className="font-medium">{index + 1}.</Label>
                    {readOnly ? (
                        <p className="text-gray-800 flex-grow">{question.text}</p>
                    ) : (
                        <Input
                            value={question.text}
                            onChange={(e) => onQuestionChange(index, e.target.value)}
                            placeholder="Enter statement..."
                            className="flex-grow"
                        />
                    )}
                </div>
                
                {readOnly ? (
                    <Badge variant="default">Person {question.correctPerson}</Badge>
                ) : (
                <div className="flex items-center gap-2">
                    <Select
                    value={question.correctPerson || ''}
                    onValueChange={(value: string) => onCorrectPersonChange(index, value)}
                    >
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Person..." />
                    </SelectTrigger>
                    <SelectContent>
                        {availablePersons.map(person => (
                        <SelectItem key={person} value={person}>Person {person}</SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                    <Button type="button" variant="ghost" size="sm" onClick={() => onRemoveQuestion(index)} className="text-red-500">
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
                )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
