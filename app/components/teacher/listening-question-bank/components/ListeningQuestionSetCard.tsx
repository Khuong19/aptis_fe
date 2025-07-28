'use client';

import {
  Card,
  CardContent,
  CardHeader,
  Badge,
  Button
} from '@/app/components/ui/basic';
import { Eye, Edit } from "lucide-react";
import { QuestionSet } from '@/app/types/question-bank';
import ClientOnlyDate from './ClientOnlyDate';

// Custom Card components to match Reading Question Bank
const CardTitle: React.FC<React.PropsWithChildren<{className?: string}>> = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>
);

const CardDescription: React.FC<React.PropsWithChildren<{className?: string}>> = ({ children, className = '' }) => (
  <p className={`text-sm text-gray-500 ${className}`}>{children}</p>
);

interface ListeningQuestionSetCardProps {
  set: QuestionSet;
  onView: (set: QuestionSet) => void;
  onEdit?: (set: QuestionSet) => void;
}

export default function ListeningQuestionSetCard({ set, onView, onEdit }: ListeningQuestionSetCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{set.title}</CardTitle>
            <CardDescription className="mt-1">
              By {set.authorName} • <ClientOnlyDate dateString={set.createdAt || new Date().toISOString()} />
            </CardDescription>
          </div>
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => onView(set)}>
              <Eye className="h-4 w-4" />
            </Button>
            {onEdit && (
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => onEdit(set)}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge>
            Listening
          </Badge>
          <Badge variant="outline">
            Part {set.part}
          </Badge>
          <Badge variant="outline">{set.level}</Badge>
          
          {/* Source badge - Official vs AI-generated */}
          {set.source === 'official' ? (
            <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
              Official
            </Badge>
          ) : set.source === 'ai-generated' ? (
            <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-700">
              AI-Generated
            </Badge>
          ) : set.source === 'manual' ? (
            <Badge variant="outline" className="bg-orange-50 border-orange-200 text-orange-700">
              Manual
            </Badge>
          ) : null}
          
          {/* Visibility badge */}
          {set.isPublic ? (
            <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
              Public
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-700">
              Private
            </Badge>
          )}
        </div>
        <div className="text-sm text-gray-500">
          {(Array.isArray(set.questions) ? set.questions.length : 0)} questions
        </div>
      </CardContent>
    </Card>
  );
} 