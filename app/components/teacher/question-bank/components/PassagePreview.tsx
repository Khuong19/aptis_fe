'use client';

import { Card, CardContent } from '@/app/components/ui/basic';

interface PassagePreviewProps {
  passage: any;
  index: number;
}

const PassagePreview = ({ passage, index }: PassagePreviewProps) => {
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <h3 className="font-medium text-lg mb-2">Passage {index + 1}</h3>
        <div className="prose prose-sm max-w-none">
          <div dangerouslySetInnerHTML={{ __html: passage.content }} />
        </div>
      </CardContent>
    </Card>
  );
};

export default PassagePreview;
