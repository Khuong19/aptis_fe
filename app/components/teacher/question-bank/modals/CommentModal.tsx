'use client';

import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  Button,
  Textarea,
  Avatar,
  AvatarFallback,
  toast
} from '@/app/components/ui/basic';
import { MessageSquare, Send } from "lucide-react";

// Import shared types
import { Question, QuestionSet, Comment } from '@/app/types/question-bank';

interface CommentModalProps {
  isOpen: boolean;
  questionSet: QuestionSet | null;
  comments: Comment[];
  onClose: () => void;
  onAddComment: (questionSetId: string, text: string) => void;
  currentUserName: string;
}

export default function CommentModal({
  isOpen,
  questionSet,
  comments,
  onClose,
  onAddComment,
  currentUserName
}: CommentModalProps) {
  const [newComment, setNewComment] = useState('');

  if (!questionSet) {
    return null;
  }

  const handleSubmit = () => {
    if (!newComment.trim()) {
      toast({
        title: "Error",
        description: "Comment text cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    onAddComment(questionSet.id, newComment);
    setNewComment('');
    
    toast({
      title: "Success",
      description: "Comment added successfully",
    });
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Comments</DialogTitle>
          <p className="text-sm text-gray-500">
            Question Set: {questionSet.title} (Part {questionSet.part})
          </p>
        </DialogHeader>
        
        {/* Comments List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 max-h-[50vh]">
          {comments.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 p-3 rounded-lg bg-gray-50">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-[#152C61] text-white">
                    {getInitials(comment.authorName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{comment.authorName}</span>
                    <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-gray-700">{comment.text}</p>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Comment Form */}
        <div className="border-t pt-4 mt-auto">
          <div className="flex gap-2">
            <Textarea
              value={newComment}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewComment(e.target.value)}
              placeholder="Add your comment..."
              className="flex-1 min-h-[80px]"
            />
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button 
              onClick={handleSubmit}
              className="bg-[#152C61] hover:bg-[#0f1f45]"
              disabled={!newComment.trim()}
            >
              <Send className="w-4 h-4 mr-2" />
              Submit Comment
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
