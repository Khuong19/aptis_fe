'use client';

import { useState } from 'react';
import { QuestionSet, Comment } from '@/app/types/question-bank';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Textarea } from '@/app/components/ui/basic';
import { X, MessageCircle, Send } from 'lucide-react';

interface CommentModalProps {
  isOpen: boolean;
  questionSet: QuestionSet;
  comments: Comment[];
  onClose: () => void;
  onAddComment: (questionSetId: string, text: string) => void;
}

export default function CommentModal({
  isOpen,
  questionSet,
  comments,
  onClose,
  onAddComment
}: CommentModalProps) {
  const [newComment, setNewComment] = useState('');

  if (!isOpen || !questionSet) return null;

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      onAddComment(questionSet.id, newComment.trim());
      setNewComment('');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const questionSetComments = comments.filter(comment => comment.questionSetId === questionSet.id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold">Comments</h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Question Set Info */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">{questionSet.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Listening Part {questionSet.part} - {questionSet.level}
              </p>
            </CardContent>
          </Card>

          {/* Comments List */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Comments ({questionSetComments.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {questionSetComments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No comments yet. Be the first to comment!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {questionSetComments.map((comment) => (
                    <div key={comment.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-gray-900">{comment.authorName}</span>
                        <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                      </div>
                      <p className="text-gray-700">{comment.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Add New Comment */}
          <Card>
            <CardHeader>
              <CardTitle>Add Comment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write your comment here..."
                  rows={3}
                  className="resize-none"
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Post Comment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

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