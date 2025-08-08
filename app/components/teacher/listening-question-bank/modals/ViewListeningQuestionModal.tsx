'use client';

import { QuestionSet } from '@/app/types/question-bank';
import { Button } from '@/app/components/ui/basic';
import { X } from 'lucide-react';
import ListeningPart1 from '../create-question-set/shared/ListeningPart1';
import ListeningPart2 from '../create-question-set/shared/ListeningPart2';
import ListeningPart3 from '../create-question-set/shared/ListeningPart3';
import ListeningPart4 from '../create-question-set/shared/ListeningPart4';

// Define the expected shape for part 4 data
interface LectureQuestion {
  id: string;
  text: string;
  options: Record<string, string>;
  answer: string;
}

interface Lecture {
  id: string;
  topic: string;
  speaker: string;
  audioText: string;
  questions: LectureQuestion[];
  audioUrl?: string;
}

// Base interface with common properties for all parts
interface BasePreviewData {
  title: string;
  description: string;
  type: string;
  part: number;
  level: string;
  audioFiles: string[];
  passageText: string;
  passage?: string;
  [key: string]: any; // Allow additional properties
}

// For part 1 specific data
interface Part1PreviewData extends BasePreviewData {
  part: 1;
  conversations: any[];
  lectures?: never;
  monologue?: never;
  speakers?: never;
  discussion?: never;
  questions: any[];
  passages: any[];
}

// For part 2 specific data
interface Part2PreviewData extends BasePreviewData {
  part: 2;
  monologue: any;
  lectures?: never;
  conversations?: never;
  speakers?: never;
  discussion?: never;
  questions: any[];
  passages: any[];
}

// For part 3 specific data
interface Part3PreviewData extends BasePreviewData {
  part: 3;
  discussion: any[];
  speakers: any[];
  lectures?: never;
  conversations?: never;
  monologue?: never;
  questions: any[];
  passages: any[];
}

// For part 4 specific data
interface Part4PreviewData extends BasePreviewData {
  part: 4;
  lectures: Lecture[];
  // Make other part-specific properties never
  conversations?: never;
  monologue?: never;
  speakers?: never;
  discussion?: never;
  questions: any[]; // allow empty array to satisfy ListeningPart4 props
  passages?: never;
}

// Union type for all possible preview data types
type PreviewData = Part1PreviewData | Part2PreviewData | Part3PreviewData | Part4PreviewData;

interface ViewListeningQuestionModalProps {
  isOpen: boolean;
  questionSet: QuestionSet & {
    description?: string;
    conversations?: any[];
    audioFiles?: string[];
    passageText?: string;
    passages?: any[];
    monologue?: any;
    speakers?: any[];
    discussion?: any[];
    lectures?: any[];
  };
  onClose: () => void;
}

export default function ViewListeningQuestionModal({
  isOpen,
  questionSet,
  onClose
}: ViewListeningQuestionModalProps) {
  if (!isOpen || !questionSet) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPartLabel = (part: number) => {
    switch (part) {
      case 1: return 'Part 1 - Understanding Factual Information';
      case 2: return 'Part 2 - Understanding Factual Information';
      case 3: return 'Part 3 - Understanding Factual Information';
      case 4: return 'Part 4 - Understanding Factual Information';
      default: return `Part ${part}`;
    }
  };

  // Prepare preview data for the shared component
  const baseData = {
    title: questionSet.title || `Listening Part ${questionSet.part}`,
    description: questionSet.description || `Listening Part ${questionSet.part} exercise`,
    type: questionSet.type || 'listening',
    part: questionSet.part || 4,
    level: questionSet.level || 'B1',
    audioFiles: questionSet.audioFiles || [],
    passageText: questionSet.passageText || ''
  } as const;

  let previewData: PreviewData;
  
  if (questionSet.part === 4) {
    // For part 4, use the lecture-based structure
    previewData = {
      ...baseData,
      lectures: (questionSet.lectures || []).map(lecture => ({
        ...lecture,
        questions: (lecture.questions || []).map(q => {
          // Convert options to Record<string, string> format
          let options: Record<string, string> = {};
          
          if (Array.isArray(q.options)) {
            // Handle array of options
            options = q.options.reduce<Record<string, string>>((acc, opt, index) => {
              const key = String.fromCharCode(65 + index); // A, B, C, ...
              acc[key] = typeof opt === 'object' ? (opt as any).text || '' : String(opt);
              return acc;
            }, {});
          } else if (q.options && typeof q.options === 'object') {
            // Handle object options
            options = Object.entries(q.options).reduce<Record<string, string>>((acc, [key, value]) => {
              acc[key] = String(value);
              return acc;
            }, {});
          }
          
          return {
            ...q,
            answer: q.answer || '',
            options
          };
        })
      }))
    } as Part4PreviewData;
  } else {
    // For parts 1-3, use the conversation/monologue structure
    // Use type assertion based on the part number
    switch (questionSet.part) {
      case 1:
        previewData = {
          ...baseData,
          part: 1,
          conversations: questionSet.conversations || [],
          questions: questionSet.questions || [],
          passages: questionSet.passages || []
        } as Part1PreviewData;
        break;
      case 2:
        previewData = {
          ...baseData,
          part: 2,
          monologue: questionSet.monologue || {},
          questions: questionSet.questions || [],
          passages: questionSet.passages || []
        } as Part2PreviewData;
        break;
      case 3:
        previewData = {
          ...baseData,
          part: 3,
          discussion: questionSet.discussion || [],
          speakers: questionSet.speakers || [],
          questions: questionSet.questions || [],
          passages: questionSet.passages || []
        } as Part3PreviewData;
        break;
      default:
        // Fallback to Part1PreviewData as a safe default
        previewData = {
          ...baseData,
          part: questionSet.part,
          conversations: questionSet.conversations || [],
          questions: questionSet.questions || [],
          passages: questionSet.passages || []
        } as Part1PreviewData;
    }
  };

  // Prepare the base preview data with required properties
  const basePreviewData = {
    title: previewData.title,
    description: previewData.description,
    type: previewData.type,
    part: previewData.part,
    level: previewData.level,
    audioFiles: previewData.audioFiles || [],
    passageText: previewData.passageText,
    passage: previewData.passage,
    passages: previewData.passages,
    questions: previewData.questions || [], // Always include questions
  };

  // Render the appropriate component based on the part
  const renderPartComponent = () => {
    const commonProps = {
      onEdit: () => {}
    };

    console.log(previewData);

    switch (questionSet.part) {
      case 1: {
        const part1Data: Part1PreviewData = {
          ...basePreviewData,
          part: 1,
          conversations: previewData.conversations || [],
          questions: previewData.questions || [],
          passages: previewData.passages || []
        };
        return <ListeningPart1 previewData={part1Data} {...commonProps} />;
      }
      case 2: {
        const part2Data: Part2PreviewData = {
          ...basePreviewData,
          part: 2,
          monologue: previewData.monologue || {},
          questions: previewData.questions || [],
          passages: previewData.passages || []
        };
        return <ListeningPart2 previewData={part2Data} {...commonProps} />;
      }
      case 3: {
        const part3Data: Part3PreviewData = {
          ...basePreviewData,
          part: 3,
          speakers: previewData.speakers || [],
          discussion: previewData.discussion || [],
          questions: previewData.questions || [],
          passages: previewData.passages || [],
        };
        return <ListeningPart3 previewData={part3Data} {...commonProps} />;
      }
      case 4: {
        // Remove speakers from the preview data for part 4
        const { speakers, ...basePreviewDataWithoutSpeakers } = basePreviewData as any;
        const part4Data: Part4PreviewData = {
          ...basePreviewDataWithoutSpeakers,
          part: 4,
          lectures: (previewData as Part4PreviewData).lectures || [],
          questions: basePreviewData.questions || [],
        };
        return <ListeningPart4 previewData={part4Data} {...commonProps} />;
      }
      default:
        return <div>Unsupported part: {questionSet.part}</div>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Listening Question Set: {questionSet.title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {renderPartComponent()}
          
          <div className="flex justify-end mt-6">
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}