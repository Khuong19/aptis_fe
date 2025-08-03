'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/basic';
import AudioPlayer from './AudioPlayer';

const AudioDemo: React.FC = () => {
  const testAudioFiles = [
    {
      name: 'Passage Audio',
      url: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/uploads/listening/sample/passage.mp3`,
      description: 'Main listening passage'
    },
    {
      name: 'Segment 0',
      url: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/uploads/listening/sample/segment-0.mp3`,
      description: 'First segment of monologue'
    },
    {
      name: 'Segment 1',
      url: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/uploads/listening/sample/segment-1.mp3`,
      description: 'Second segment of monologue'
    },
    {
      name: 'Conversation 0',
      url: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/uploads/listening/sample/conversation-0.mp3`,
      description: 'First conversation'
    },
    {
      name: 'Speaker 0',
      url: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/uploads/listening/sample/speaker-0.mp3`,
      description: 'First speaker in discussion'
    },
    {
      name: 'Lecture 0',
      url: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/uploads/listening/sample/lecture-0.mp3`,
      description: 'First lecture'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>🎵 Audio Demo - Test Audio Files</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            This demo shows audio files served from the upload/listening folder. 
            These are test files created for demonstration purposes.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testAudioFiles.map((file, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{file.name}</h4>
                  <AudioPlayer 
                    audioUrl={file.url}
                    label="Play"
                    size="sm"
                    showLabel={false}
                  />
                </div>
                <p className="text-sm text-gray-600">{file.description}</p>
                <p className="text-xs text-gray-500 mt-1">{file.url}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">📁 File Structure</h4>
            <p className="text-sm text-blue-700">
              Audio files are stored in: <code>backend/uploads/listening/sample/</code>
            </p>
            <p className="text-sm text-blue-700 mt-1">
              Access via: <code>{process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/uploads/listening/sample/[filename]</code>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioDemo; 