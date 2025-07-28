'use client';

import React from 'react';
import { Card, Badge } from '@/app/components/ui/basic';
import { Volume2, Users, MessageSquare, User } from 'lucide-react';

interface ListeningPreviewProps {
  part: string;
  data: any;
  audioFiles?: string[];
}

export default function ListeningPreview({ part, data, audioFiles = [] }: ListeningPreviewProps) {
  const renderPart1Preview = () => {
    if (!data.conversations) return null;
    
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Part 1: Short Conversations</h3>
          <Badge variant="outline">{data.conversations.length} conversations</Badge>
        </div>
        
        {data.conversations.map((conversation: any, index: number) => (
          <Card key={conversation.id || index} className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">
                  Conversation {index + 1}: {conversation.title}
                </h4>
                <div className="flex items-center gap-2">
                  {conversation.difficulty && (
                    <Badge variant={conversation.difficulty === 'A2+' ? 'outline' : 'default'}>
                      {conversation.difficulty}
                    </Badge>
                  )}
                  <Badge variant="success">{conversation.context}</Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                {conversation.segments?.map((segment: any, segIndex: number) => (
                  <div key={segment.id || segIndex} className="flex items-start space-x-2 p-2 bg-gray-50 rounded">
                    <User className="w-4 h-4 text-gray-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">{segment.text}</p>
                      {segment.speaker && (
                        <p className="text-xs text-gray-500">Speaker: {segment.speaker}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {conversation.question && (
                <div className="border-t pt-3">
                  <p className="font-medium text-gray-900 mb-2">{conversation.question.text}</p>
                  <div className="space-y-1">
                    {Object.entries(conversation.question.options || {}).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                          {key}
                        </span>
                        <span className="text-sm">{value as string}</span>
                        {conversation.question.answer === key && (
                          <Badge variant="success" className="text-xs">Correct</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const renderPart2Preview = () => {
    // Check for new format (speakers) first, then fallback to old format (monologue)
    if (data.speakers && data.speakers.length > 0) {
      return (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold">Part 2: 4 Speakers Matching</h3>
            <Badge variant="outline">{data.speakers.length} speakers</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.speakers.map((speaker: any, index: number) => (
              <Card key={speaker.id || index} className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{speaker.name}</h4>
                    <Badge variant="outline">{String.fromCharCode(65 + index)}</Badge>
                  </div>
                  <p className="text-sm text-gray-700">{speaker.opinion}</p>
                  {speaker.segment && (
                    <div className="p-2 bg-gray-50 rounded">
                      <p className="text-xs text-gray-600">{speaker.segment.text}</p>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
          
          {data.questions && (
            <Card className="p-4">
              <h5 className="font-medium text-gray-900 mb-3">Matching Questions:</h5>
              {data.questions.map((question: any, index: number) => (
                <div key={question.id || index} className="mb-3 p-2 bg-green-50 rounded">
                  <p className="text-sm font-medium mb-1">{index + 1}. {question.text}</p>
                  <div className="space-y-1">
                    {Object.entries(question.options || {}).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                          {key}
                        </span>
                        <span className="text-sm">{value as string}</span>
                        {question.answer === key && (
                          <Badge variant="success" className="text-xs">Correct</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </Card>
          )}
        </div>
      );
    }
    
    // Fallback to old monologue format
    if (!data.monologue) return null;
    
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <User className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold">Part 2: Long Monologue</h3>
          <Badge variant="outline">{data.monologue.questions?.length || 0} questions</Badge>
        </div>
        
        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">{data.monologue.title}</h4>
              <Badge variant="success">{data.monologue.topic}</Badge>
            </div>
            
            <div className="space-y-2">
              {data.monologue.segments?.map((segment: any, index: number) => (
                <div key={segment.id || index} className="p-2 bg-gray-50 rounded">
                  <p className="text-sm text-gray-700">{segment.text}</p>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-3">
              <h5 className="font-medium text-gray-900 mb-2">Questions:</h5>
              {data.monologue.questions?.map((question: any, index: number) => (
                <div key={question.id || index} className="mb-3 p-2 bg-blue-50 rounded">
                  <p className="text-sm font-medium mb-1">{index + 1}. {question.text}</p>
                  <div className="space-y-1">
                    {Object.entries(question.options || {}).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                          {key}
                        </span>
                        <span className="text-sm">{value as string}</span>
                        {question.answer === key && (
                          <Badge variant="success" className="text-xs">Correct</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const renderPart3Preview = () => {
    if (!data.speakers) return null;
    
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Users className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold">Part 3: Multiple Speakers</h3>
          <Badge variant="outline">{data.speakers.length} speakers</Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.speakers.map((speaker: any, index: number) => (
            <Card key={speaker.id || index} className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">{speaker.name}</h4>
                  <Badge variant="outline">{String.fromCharCode(65 + index)}</Badge>
                </div>
                <p className="text-sm text-gray-700">{speaker.opinion}</p>
              </div>
            </Card>
          ))}
        </div>
        
        {data.questions && (
          <Card className="p-4">
            <h5 className="font-medium text-gray-900 mb-3">Questions:</h5>
            {data.questions.map((question: any, index: number) => (
              <div key={question.id || index} className="mb-3 p-2 bg-purple-50 rounded">
                <p className="text-sm font-medium mb-1">{index + 1}. {question.text}</p>
                <div className="space-y-1">
                  {Object.entries(question.options || {}).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                        {key}
                      </span>
                      <span className="text-sm">{value as string}</span>
                      {question.answer === key && (
                        <Badge variant="success" className="text-xs">Correct</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Card>
        )}
      </div>
    );
  };

  const renderAudioStatus = () => {
    if (audioFiles.length === 0) return null;
    
    return (
      <Card className="p-4 border-2 border-green-100 bg-green-50">
        <div className="flex items-center space-x-2">
          <Volume2 className="w-5 h-5 text-green-600" />
          <span className="font-medium text-green-800">Audio Generated</span>
          <Badge variant="success">{audioFiles.length} files</Badge>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {renderAudioStatus()}
      
      {part === '1' && renderPart1Preview()}
      {part === '2' && renderPart2Preview()}
      {part === '3' && renderPart3Preview()}
      
      {!['1', '2', '3'].includes(part) && (
        <div className="text-center p-8 border border-dashed rounded-md">
          <p className="text-gray-500">Preview not available for Part {part}</p>
        </div>
      )}
    </div>
  );
} 