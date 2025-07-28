import React from 'react';
import ReadingPart1Example from '@/app/components/learner/reading/ReadingPart1Example';
import { Button } from '@/app/components/ui/basic';
import Link from 'next/link';

export default function ReadingPart1Page() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">APTIS Reading Practice - Part 1</h1>
        <Link href="/learner/practice">
          <Button variant="outline">Back to Practice</Button>
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Instructions</h2>
          <p className="text-gray-700">
            In this part of the test, you will read an email with gaps. 
            For each gap, choose the correct word from the dropdown menu.
            The first question has been answered as an example.
          </p>
        </div>
        
        <ReadingPart1Example />
        
        <div className="mt-8 flex justify-end">
          <Button className="mr-4" variant="outline">Previous</Button>
          <Button>Next</Button>
        </div>
      </div>
    </div>
  );
}
