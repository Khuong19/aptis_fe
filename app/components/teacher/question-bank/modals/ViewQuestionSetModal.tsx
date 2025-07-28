'use client';

import { QuestionSet } from '@/app/types/question-bank';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Badge,
} from '@/app/components/ui/basic';
import { Book, Headphones } from 'lucide-react';

interface ViewQuestionSetModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionSet: QuestionSet | null;
}


const convertHeadingsToArray = (headings: any): any[] => {
  if (Array.isArray(headings)) {
    return headings;
  }
  
  if (headings && typeof headings === 'object') {
    return Object.entries(headings).map(([key, value], index) => ({
      id: key,
      text: value as string,
      index: index
    }));
  }
  
  return [];
};

const convertParagraphsToArray = (paragraphs: any): any[] => {
  if (Array.isArray(paragraphs)) {
    return paragraphs;
  }
  
  if (paragraphs && typeof paragraphs === 'object') {
    return Object.entries(paragraphs).map(([key, value], index) => ({
      id: key,
      text: typeof value === 'string' ? value : (value as any)?.text || '',
      isExample: (value as any)?.isExample || false,
      correctHeadingId: (value as any)?.correctHeadingId || null,
      index: index
    }));
  }
  
  return [];
};

const convertPassagesToArray = (passages: any, questionSet?: any): any[] => {
  if (Array.isArray(passages)) {
    return passages;
  }
  
  if (passages && typeof passages === 'object') {
    const converted = Object.entries(passages).map(([key, value], index) => {
      return {
        id: key,
        person: (value as any)?.person || key,
        text: typeof value === 'string' ? value : (value as any)?.text || '',
        index: index
      };
    });
    return converted;
  }
  
  if (questionSet) {
    if (questionSet.setA?.passages) {
      return Array.isArray(questionSet.setA.passages) ? questionSet.setA.passages : [];
    }
    if (questionSet.setB?.passages) {
      return Array.isArray(questionSet.setB.passages) ? questionSet.setB.passages : [];
    }
    
    if (questionSet.data?.passages) {
      return Array.isArray(questionSet.data.passages) ? questionSet.data.passages : [];
    }
    
    if (questionSet.passageText && typeof questionSet.passageText === 'string') {
      try {
        const parsed = JSON.parse(questionSet.passageText);
        if (parsed.setA?.passages) {
          return Array.isArray(parsed.setA.passages) ? parsed.setA.passages : [];
        }
        if (parsed.passages) {
          return Array.isArray(parsed.passages) ? parsed.passages : [];
        }
      } catch (error) {
        console.log('Could not parse passageText as JSON');
      }
    }
  }
  
  return [];
};

const parsePassageText = (passageText: any): any[] => {
  if (Array.isArray(passageText)) {
    return passageText;
  }
  
  if (typeof passageText === 'string') {
    if (passageText.trim().startsWith('[')) {
      try {
        return JSON.parse(passageText);
      } catch (error) {
        return [];
      }
    }
    return [];
  }
  
  return [];
};

const ReadingPart1View = ({ questionSet }: { questionSet: QuestionSet }) => {
  // Extract passage from questions[0].passage since backend stores it there, with fallback
  const passageText = questionSet?.questions?.[0]?.passage || questionSet?.passageText || '';

  return (
    <div className="space-y-6">
      {/* Passage Section - Email Style */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Passage</h3>
        <div className="p-4 border rounded-lg bg-gray-50">
          <div className="email-container bg-white border border-gray-200 rounded-md p-5 shadow-sm">
            <div className="email-header border-b pb-3 mb-3">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium text-gray-700">Choose the word that fits in the gap. the first one is done for you.</p>
                </div>
              </div>
            </div>
            <div className="email-body">
              {passageText ? (
                <div>
                  {(() => {
                    // Email structure: greeting, main content, signature
                    const greetingMatch = passageText.match(/^(Hey|Hi|Hello|Dear|Hi)\s+[^,]+,/);
                    let greeting = '';
                    let content = passageText;
                    if (greetingMatch) {
                      greeting = greetingMatch[0];
                      content = content.substring(greeting.length).trim();
                    }
                    let mainContent = content;
                    let signature = '';
                    // Signature: e.g., 'Love,\nHelen' or similar
                    const signatureMatch = content.match(/(Love|Regards|Best|Sincerely|Yours|Thanks),\s*[\w\s]+$/i);
                    if (signatureMatch) {
                      const signatureStart = content.lastIndexOf(signatureMatch[0]);
                      mainContent = content.substring(0, signatureStart).trim();
                      signature = content.substring(signatureStart).trim();
                    }
                    // Render mainContent with dropdowns (read-only for modal view)
                    const gapRegex = /\[(\d+)\]/g;
                    let lastIndex = 0;
                    let match;
                    const elements: React.ReactNode[] = [];
                    let gapCount = 0;
                    while ((match = gapRegex.exec(mainContent)) !== null) {
                      const start = match.index;
                      const end = gapRegex.lastIndex;
                      elements.push(
                        <span key={`text-${gapCount}`}>{mainContent.slice(lastIndex, start)}</span>
                      );
                      const gapIdx = parseInt(match[1], 10) - 1;
                      const question = questionSet.questions?.[gapIdx];
                      const selectedAnswer = question?.answer || '';
                      const selectedOption = selectedAnswer ? question?.options?.[selectedAnswer] : '';
                      
                      elements.push(
                        <select
                          key={`gap-${gapCount}`}
                          className="mx-1 px-2 py-1 border border-yellow-300 rounded bg-yellow-100 text-sm font-medium min-w-[80px]"
                          value={selectedAnswer}
                          disabled // Read-only in modal view
                        >
                          <option value="" disabled className="text-gray-400">Select...</option>
                          {question && Object.entries(question.options || {}).map(([key, value]) => (
                            <option key={key} value={key} className="text-gray-900">
                              {String(value)}
                            </option>
                          ))}
                        </select>
                      );
                      lastIndex = end;
                      gapCount++;
                    }
                    if (lastIndex < mainContent.length) {
                      elements.push(
                        <span key="text-final">{mainContent.slice(lastIndex)}</span>
                      );
                    }
                    return (
                      <>
                        {greeting && <p className="mb-2 font-semibold">{greeting}</p>}
                        <p className="text-sm whitespace-pre-wrap leading-relaxed mb-4">{elements}</p>
                        {signature && (
                          <div className="mt-4">
                            {signature.split(/\n|\r/).map((line, idx) => (
                              <p key={idx} className={idx === 0 ? 'font-semibold' : ''}>{line}</p>
                            ))}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">No passage available</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Questions</h3>
        <div className="space-y-4">
          {questionSet.questions?.map((q: any, idx: number) => (
            <div key={q.id || idx} className="p-4 border rounded-lg bg-white shadow-sm">
              <div className="mb-2 font-medium">{idx + 1}. {q.text}</div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(q.options || {}).map(([key, value]) => (
                  <span key={key} className={`px-3 py-1 rounded border ${q.answer === key ? 'bg-green-100 border-green-400' : 'bg-gray-50 border-gray-200'}`}>{key}: {value as string}</span>
                ))}
              </div>
              {q.explanation && <div className="mt-2 text-sm text-gray-500">{q.explanation}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ReadingPart2View = ({ questionSet }: { questionSet: QuestionSet }) => {

  let sentences: any[] = [];
  
  if (questionSet.questions && questionSet.questions.length > 0) {
    questionSet.questions.forEach((q: any, qIndex: number) => {
      if (q.sentences) {
        if (Array.isArray(q.sentences)) {
          q.sentences.forEach((sentence: any, sIndex: number) => {
            sentences.push({
              id: sentence.id || `sentence_${qIndex}_${sIndex}`,
              text: sentence.text || sentence,
              isExample: sentence.isExample || false,
              position: sentence.position || sIndex + 1,
              questionIndex: qIndex
            });
          });
        } else if (typeof q.sentences === 'object' && q.sentences.text) {
          sentences.push({
            id: q.sentences.id || `sentence_${qIndex}`,
            text: q.sentences.text,
            isExample: q.sentences.isExample || false,
            position: q.sentences.position || qIndex + 1,
            questionIndex: qIndex
          });
        }
      } else if (q.sentence) {
        sentences.push({
          id: q.id || `sentence_${qIndex}`,
          text: q.sentence,
          isExample: q.isExample || false,
          position: q.position || qIndex + 1,
          questionIndex: qIndex
        });
      } else if (q.text && questionSet.part === 2) {
        sentences.push({
          id: q.id || `sentence_${qIndex}`,
          text: q.text,
          isExample: q.isExample || false,
          position: q.position || qIndex + 1,
          questionIndex: qIndex
        });
      }
    });
  }
  
  if (sentences.length === 0) {
    sentences = parsePassageText(questionSet.passageText);
  }
  
  sentences.sort((a, b) => (a.position || 0) - (b.position || 0));
  
  return (
    <div className="space-y-6">
      {sentences.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Sentences in Correct Order</h3>
          <div className="space-y-2">
            {sentences.map((s, idx) => (
              <div key={s.id || idx} className="p-3 border rounded flex items-center gap-3 bg-gray-50">
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold">
                  {s.position || idx + 1}
                </span>
                <span className="flex-1">{s.text}</span>
                {s.isExample && <Badge className="ml-2 bg-blue-100 text-blue-800">Example</Badge>}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {sentences.length === 0 && questionSet.passageText && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Passage Text</h3>
          <div className="p-4 border rounded-lg bg-gray-50">
            <p className="whitespace-pre-line text-gray-800">{questionSet.passageText}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const ReadingPart3View = ({ questionSet }: { questionSet: QuestionSet }) => {
  let passages = convertPassagesToArray(questionSet.passages, questionSet);
  
  if (passages.length === 0 && questionSet.questions?.length > 0) {
    const uniquePersons = new Set<string>();
    questionSet.questions.forEach((q: any) => {
      if (q.correctPerson) uniquePersons.add(q.correctPerson);
      if (q.answer) uniquePersons.add(q.answer);
    });
    
    passages = Array.from(uniquePersons).map((person, index) => ({
      id: `person_${person}`,
      person: person,
      text: `Passage from Person ${person} (Data not properly structured from backend)`,
      index: index
    }));
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Passages</h3>
        <div className="space-y-4">
          {passages.length > 0 ? passages.map((p, idx) => (
            <div key={p.id || idx} className="p-4 border rounded-lg bg-gray-50 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-bold text-sm">{p.person}</div>
                <p className="font-semibold text-gray-700">Person {p.person}</p>
              </div>
              <p className="text-sm text-gray-800 leading-relaxed">{p.text}</p>
            </div>
          )) : <div className="text-gray-400">No passages</div>}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Questions</h3>
        <div className="space-y-4">
          {questionSet.questions?.map((q: any, idx: number) => (
            <div key={q.id || idx} className="p-4 border rounded-lg bg-white shadow-sm">
              <div className="mb-2 font-medium">{idx + 1}. {q.text}</div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-green-700">Answer:</span>
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-700 font-bold">{q.correctPerson || q.answer}</span>
              </div>
              {q.explanation && <div className="mt-2 text-sm text-gray-500">{q.explanation}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ReadingPart4View = ({ questionSet }: { questionSet: QuestionSet }) => {
  let paragraphs: any[] = [];
  if (questionSet.questions && questionSet.questions.length > 0) {
    paragraphs = questionSet.questions.map((q: any, index: number) => ({
      id: q.id || `paragraph_${index}`,
      text: q.text || '',
      isExample: q.isExample || index === 0,
      correctHeadingId: q.answer || q.correctHeadingId,
      index: index,
      sectionNumber: q.sectionNumber || index
    }));
  } else {
    paragraphs = convertParagraphsToArray(questionSet.paragraphs);
  }
  
  const headings = convertHeadingsToArray(questionSet.headings);
  
  return (
    <div className="space-y-6">
      {questionSet.passageText && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Passage</h3>
          <div className="p-4 border rounded-lg bg-gray-50">
            <p className="text-gray-800 whitespace-pre-line">{questionSet.passageText}</p>
          </div>
        </div>
      )}
      <div>
        <h3 className="text-lg font-semibold mb-2">Match the headings to the paragraphs</h3>
        <p className="text-sm text-gray-500 mb-6">There is one heading that you will not use.</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-700 mb-3">Paragraphs</h4>
            {paragraphs.length > 0 ? paragraphs.map((paragraph, pIdx) => {    
              let correctHeading = null;
              let headingIndex = -1;
              
              if (paragraph.correctHeadingId) {
                correctHeading = headings?.find(h => h.id === paragraph.correctHeadingId);
                headingIndex = headings?.findIndex(h => h.id === paragraph.correctHeadingId);
                
                if (!correctHeading && typeof paragraph.correctHeadingId === 'string') {
                  const letterIndex = paragraph.correctHeadingId.charCodeAt(0) - 65;
                  if (letterIndex >= 0 && letterIndex < headings.length) {
                    correctHeading = headings[letterIndex];
                    headingIndex = letterIndex;
                  }
                }
              }
              
              return (
                <div key={paragraph.id || pIdx} className="p-4 border rounded-lg bg-gray-50 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center font-bold text-sm">
                      {paragraph.isExample ? 'Ex' : paragraph.sectionNumber ?? pIdx}
                    </div>
                    <p className="font-semibold text-gray-600">
                      {paragraph.isExample ? 'Example' : `Paragraph ${paragraph.sectionNumber ?? pIdx}`}
                    </p>
                  </div>
                  <p className="mb-4 text-gray-800 leading-relaxed">{paragraph.text}</p>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-green-700">Answer:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-green-100 text-green-800 rounded-full flex items-center justify-center font-bold text-xs">
                        {headingIndex !== -1 ? String.fromCharCode(65 + headingIndex) : paragraph.correctHeadingId || '?'}
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
                        {correctHeading?.text || paragraph.correctHeadingId || 'Not Found'}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            }) : <div className="text-gray-400">No paragraphs found</div>}
          </div>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-white shadow-sm">
              <h4 className="font-semibold mb-4 text-gray-700">Available Headings</h4>
              <div className="space-y-3">
                {headings.length > 0 ? headings.map((heading, idx) => (
                  <div key={heading.id || idx} className="p-3 border rounded-md bg-gray-50 flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-bold text-xs">{String.fromCharCode(65 + idx)}</div>
                    <p className="text-sm text-gray-800">{heading.text}</p>
                  </div>
                )) : <div className="text-gray-400">No headings found</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ViewQuestionSetModal = ({ isOpen, onClose, questionSet }: ViewQuestionSetModalProps) => {
  if (!isOpen || !questionSet) return null;

  const renderContent = () => {
    if (questionSet.type === 'reading') {
      switch (questionSet.part) {
        case 1:
          return <ReadingPart1View questionSet={questionSet} />;
        case 2:
          return <ReadingPart2View questionSet={questionSet} />;
        case 3:
          return <ReadingPart3View questionSet={questionSet} />;
        case 4:
          return <ReadingPart4View questionSet={questionSet} />;
        default:
          return <ReadingPart1View questionSet={questionSet} />;
      }
    }
    return <ReadingPart1View questionSet={questionSet} />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl font-bold text-gray-900">{questionSet.title}</DialogTitle>
          <div className="flex items-center gap-4 text-sm text-gray-500 pt-2">
            <div className="flex items-center gap-2">
              {questionSet.type === 'reading' ? 
                <Book className="h-4 w-4 text-blue-600" /> : 
                <Headphones className="h-4 w-4 text-purple-600" />
              }
              <span className="font-medium capitalize">{questionSet.type}</span>
            </div>
            <span className="text-gray-300">•</span>
            <div className="flex items-center gap-1">
              <span className="font-medium">Part {questionSet.part}</span>
            </div>
            <span className="text-gray-300">•</span>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="text-xs">{questionSet.level}</Badge>
            </div>
            <span className="text-gray-300">•</span>
            <div className="text-gray-600">
              Created by <span className="font-medium">{questionSet.authorName}</span>
            </div>
            <span className="text-gray-300">•</span>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className={`text-xs ${
                questionSet.source === 'official' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                questionSet.source === 'ai-generated' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                'bg-orange-50 text-orange-700 border-orange-200'
              }`}>
                {questionSet.source === 'official' ? 'Official' :
                 questionSet.source === 'ai-generated' ? 'AI Generated' : 'Manual'}
              </Badge>
            </div>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto py-6">
          {renderContent()}
        </div>
        <DialogFooter className="flex-shrink-0">
          <Button variant="outline" onClick={onClose} className="px-6">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewQuestionSetModal;
