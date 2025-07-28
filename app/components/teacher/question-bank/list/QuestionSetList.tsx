'use client';

import { useState, useEffect } from 'react';
import { 
  Card,
  CardContent, 
  CardFooter, 
  CardHeader,
  Badge,
  Button
} from '@/app/components/ui/basic';
import { 
  Eye, 
  Edit2, 
  Trash2, 
  MessageSquare,
  Book, 
  Headphones,
  User,
  Globe,
  Lock,
  Tag
} from "lucide-react";
import { QuestionSet } from '@/app/types/question-bank';

// Helper component for displaying dates
const ClientOnlyDate = ({ dateString }: { dateString: string }) => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) return <span>Loading...</span>;
  
  return <span>{new Date(dateString).toLocaleDateString()}</span>;
};

// Custom Card components
const CardTitle: React.FC<React.PropsWithChildren<{className?: string}>> = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>
);

const CardDescription: React.FC<React.PropsWithChildren<{className?: string}>> = ({ children, className = '' }) => (
  <p className={`text-sm text-gray-500 ${className}`}>{children}</p>
);

interface QuestionSetListProps {
  questionSets: QuestionSet[];
  currentUser: any;
  onView: (set: QuestionSet) => void;
  onEdit: (set: QuestionSet) => void;
  onDelete: (setId: string) => void;
  onComment: (set: QuestionSet) => void;
}

export default function QuestionSetList({
  questionSets,
  currentUser,
  onView,
  onEdit,
  onDelete,
  onComment
}: QuestionSetListProps) {
  // Get color for part badge
  const getPartColor = (part: number) => {
    switch (part) {
      case 1: return 'bg-blue-100 text-blue-800';
      case 2: return 'bg-green-100 text-green-800';
      case 3: return 'bg-purple-100 text-purple-800';
      case 4: return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get color for level badge
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'A2': return 'bg-yellow-100 text-yellow-800';
      case 'B1': return 'bg-blue-100 text-blue-800';
      case 'B2': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {questionSets.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500">No question sets found</p>
        </div>
      ) : (
        questionSets.map(set => (
          <Card key={set.id} className="h-full flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="line-clamp-2">{set.title}</CardTitle>
                <div className="flex items-center space-x-1">
                  {set.type === 'reading' ? (
                    <Book className="h-4 w-4 text-blue-500" />
                  ) : (
                    <Headphones className="h-4 w-4 text-purple-500" />
                  )}
                  {set.isPublic ? (
                    <Globe className="h-4 w-4 text-green-500" />
                  ) : (
                    <Lock className="h-4 w-4 text-gray-500" />
                  )}
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <User className="h-3 w-3 mr-1" />
                <span>{set.authorName}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {set.part && (
                  <Badge className={getPartColor(set.part)}>
                    Part {set.part}
                  </Badge>
                )}
                {set.level && (
                  <Badge className={getLevelColor(set.level)}>
                    {set.level}
                  </Badge>
                )}
                <Badge variant="outline" className="flex items-center">
                  <Tag className="h-3 w-3 mr-1" />
                  {set.questions?.length || 0} Questions
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pb-2 flex-grow">
              <p className="text-sm text-gray-600 line-clamp-3">
                {set.content ? (
                  set.content.substring(0, 150) + (set.content.length > 150 ? '...' : '')
                ) : (
                  `${set.questions?.[0]?.text?.substring(0, 100)}${set.questions?.[0]?.text?.length > 100 ? '...' : ''}`
                )}
              </p>
            </CardContent>
            
            <CardFooter className="pt-2 flex justify-between items-center text-sm text-gray-500">
              <div>
                <ClientOnlyDate dateString={set.createdAt} />
              </div>
              
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={() => onView(set)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                
                {set.authorId === currentUser.id && (
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => onEdit(set)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
                
                {set.authorId === currentUser.id && (
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => onDelete(set.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={() => onComment(set)}
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
}
