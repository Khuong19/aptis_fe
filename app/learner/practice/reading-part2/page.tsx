'use client';

import React, { useState } from 'react';
import { Card, CardContent, Button } from '@/app/components/ui/basic';
import SentenceOrderingComponent, { OrderingSentence } from '@/app/components/learner/reading/SentenceOrderingComponent';
import LearnerLayout from '@/app/components/learner/layout/LearnerLayout';

// Example data for demonstration
const exampleSentences: OrderingSentence[] = [
  { id: 'sentence-0', text: 'The history of coffee dates back to the 15th century.', isExample: true },
  { id: 'sentence-1', text: 'It was first discovered in the highlands of Ethiopia.' },
  { id: 'sentence-2', text: 'From there, it spread to the Middle East, becoming popular in places like Persia, Egypt, and Turkey.' },
  { id: 'sentence-3', text: 'By the 17th century, coffee had made its way to Europe, quickly becoming a favored beverage.' },
  { id: 'sentence-4', text: 'Coffee houses in England became popular centers for social and business activities.' },
  { id: 'sentence-5', text: 'Today, it is one of the most popular drinks worldwide.' },
];

// Correct order: 0 (example), 1, 2, 3, 4, 5
const correctOrder = ['sentence-0', 'sentence-1', 'sentence-2', 'sentence-3', 'sentence-4', 'sentence-5'];

export default function ReadingPart2Page() {
  const [userAnswers, setUserAnswers] = useState<OrderingSentence[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const handleOrderChange = (orderedSentences: OrderingSentence[]) => {
    setUserAnswers(orderedSentences);
  };

  const handleSubmit = () => {
    // Calculate score
    const userOrder = userAnswers.map(sentence => sentence.id);
    let correctCount = 0;
    
    // Skip the example sentence when comparing
    for (let i = 1; i < correctOrder.length; i++) {
      if (userOrder[i] === correctOrder[i]) {
        correctCount++;
      }
    }
    
    const totalQuestions = correctOrder.length - 1; // Subtract 1 for the example
    const calculatedScore = Math.round((correctCount / totalQuestions) * 100);
    
    setScore(calculatedScore);
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setScore(null);
  };

  return (
    <LearnerLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Reading Part 2: Sentence Ordering</h1>
        
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-2">Instructions</h2>
            <p className="text-gray-700">
              The sentences below are from a biography. Order the sentences to make a story. 
              The first sentence of the story is an example.
            </p>
          </CardContent>
        </Card>
        
        <div className="mb-6">
          <SentenceOrderingComponent
            sentences={exampleSentences}
            onOrderChange={handleOrderChange}
            readOnly={submitted}
            title="Biography: Audrey Hepburn"
          />
        </div>
        
        {submitted ? (
          <div className="space-y-4">
            <Card className="bg-white">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-2">Your Score</h2>
                <div className="text-3xl font-bold text-blue-600">{score}%</div>
                <p className="mt-2 text-gray-600">
                  {score === 100 
                    ? "Perfect! You've ordered all sentences correctly."
                    : score! >= 70
                      ? "Good job! You've ordered most sentences correctly."
                      : "Keep practicing! Try to understand the logical flow of the story."}
                </p>
              </CardContent>
            </Card>
            
            <div className="flex justify-end">
              <Button onClick={handleReset}>Try Again</Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-end">
            <Button onClick={handleSubmit}>Submit Answers</Button>
          </div>
        )}
      </div>
    </LearnerLayout>
  );
}
