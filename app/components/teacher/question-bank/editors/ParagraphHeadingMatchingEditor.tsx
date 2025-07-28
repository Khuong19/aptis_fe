'use client';

import React from 'react';
import { Trash2, PlusCircle } from 'lucide-react';
import { Button, Input, Label, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Card, CardContent, CardHeader } from '@/app/components/ui/basic';
import { Paragraph, Heading } from '@/app/types/question-bank';

interface ParagraphHeadingMatchingEditorProps {
  paragraphs: Paragraph[];
  headings: Heading[];
  onParagraphsChange: (paragraphs: Paragraph[]) => void;
  onHeadingsChange: (headings: Heading[]) => void;
  readOnly?: boolean;
}

export default function ParagraphHeadingMatchingEditor({
  paragraphs,
  headings,
  onParagraphsChange,
  onHeadingsChange,
  readOnly = false,
}: ParagraphHeadingMatchingEditorProps) {

  const handleParagraphTextChange = (index: number, text: string) => {
    const newParagraphs = [...paragraphs];
    newParagraphs[index].text = text;
    onParagraphsChange(newParagraphs);
  };

  const handleHeadingTextChange = (index: number, text: string) => {
    const newHeadings = [...headings];
    newHeadings[index].text = text;
    onHeadingsChange(newHeadings);
  };

  const handleAddParagraph = () => {
    onParagraphsChange([...paragraphs, { id: `para-${Date.now()}`, text: '' }]);
  };

  const handleAddHeading = () => {
    onHeadingsChange([...headings, { id: `heading-${Date.now()}`, text: '' }]);
  };

  const handleRemoveParagraph = (index: number) => {
    const newParagraphs = paragraphs.filter((_, i) => i !== index);
    onParagraphsChange(newParagraphs);
  };

  const handleRemoveHeading = (index: number) => {
    const newHeadings = headings.filter((_, i) => i !== index);
    onHeadingsChange(newHeadings);
  };

  const handleCorrectHeadingChange = (paragraphIndex: number, headingId: string) => {
    const newParagraphs = [...paragraphs];
    newParagraphs[paragraphIndex].correctHeadingId = headingId;
    onParagraphsChange(newParagraphs);
  };

  if (readOnly) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-bold text-lg mb-2">Paragraphs & Matched Headings</h3>
          {paragraphs.map((p, index) => {
            const matchedHeading = headings.find(h => h.id === p.correctHeadingId);
            return (
              <Card key={p.id} className="mb-4">
                <CardHeader className="font-semibold bg-gray-50">
                  Paragraph {index + 1}
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="whitespace-pre-wrap">{p.text}</p>
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="font-semibold text-sm text-green-800">Correct Heading:</p>
                    <p className="text-green-700">{matchedHeading ? matchedHeading.text : <span className="text-gray-500">Not set</span>}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <div>
          <h3 className="font-bold text-lg mb-2">Available Headings</h3>
          <div className="p-4 border rounded-md bg-gray-50">
            <ul className="list-disc pl-5 space-y-2">
              {headings.map(h => (
                <li key={h.id}>{h.text}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Paragraphs Column */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg">Paragraphs</h3>
        {paragraphs.map((p, index) => (
          <Card key={p.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor={`paragraph-${index}`}>Paragraph {index + 1}</Label>
                <Button variant="ghost" onClick={() => handleRemoveParagraph(index)} className="p-1 h-8 w-8">
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
              <Textarea
                id={`paragraph-${index}`}
                value={p.text}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleParagraphTextChange(index, e.target.value)}
                placeholder={`Enter text for paragraph ${index + 1}...`}
                rows={6}
              />
              <div className="mt-4">
                <Label htmlFor={`heading-select-${index}`}>Correct Heading</Label>
                <Select
                  className="mt-1"
                  value={p.correctHeadingId || ''}
                  onValueChange={(value: string) => handleCorrectHeadingChange(index, value)}
                >
                  <SelectItem value="" disabled>Select a heading</SelectItem>
                  {headings.map(h => (
                    <SelectItem key={h.id} value={h.id}>{h.text}</SelectItem>
                  ))}
                </Select>
              </div>
            </CardContent>
          </Card>
        ))}
        <Button variant="outline" onClick={handleAddParagraph} className="w-full">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Paragraph
        </Button>
      </div>

      {/* Headings Column */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg">Headings</h3>
        {headings.map((h, index) => (
          <div key={h.id} className="flex items-center gap-2">
            <Input
              value={h.text}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleHeadingTextChange(index, e.target.value)}
              placeholder={`Heading ${index + 1}`}
            />
            <Button variant="ghost" onClick={() => handleRemoveHeading(index)} className="p-1 h-8 w-8">
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ))}
        <Button variant="outline" onClick={handleAddHeading} className="w-full">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Heading
        </Button>
      </div>
    </div>
  );
}
