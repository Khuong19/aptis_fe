import React from 'react';
import GapFillPassage, { GapFillQuestion } from './GapFillPassage';

const ReadingPart1Example: React.FC = () => {
  const title = "Office Memo: New Clean Desk Policy";

  const questions: GapFillQuestion[] = [
    {
      id: "q1",
      options: ["inform", "notify", "advise"],
      answer: "inform"
    },
    {
      id: "q2",
      options: ["ensure", "insure", "assure"],
      answer: "ensure"
    },
    {
      id: "q3",
      options: ["effective", "efficient", "official"],
      answer: "effective"
    },
    {
      id: "q4",
      options: ["belongings", "possessions", "materials"],
      answer: "belongings"
    },
    {
      id: "q5",
      options: ["cooperation", "compliance", "agreement"],
      answer: "cooperation"
    },
  ];

  const passageContent = `
To: All Staff
From: Management
Date: October 26, 2023
Subject: New Clean Desk Policy

This memo is to [Q1] you of a new company-wide clean desk policy, which will be [Q2] immediately. To [Q3] a clean and professional working environment, we ask that all employees clear their desks of personal items at the end of each day. All work-related [Q4] should be stored in the designated cabinets. Your [Q5] is greatly appreciated as we implement this new standard. Thank you.
  `;

  const userAnswers = {
    "q1": "inform"
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    console.log(`Question ${questionId}: selected answer ${answer}`);
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <GapFillPassage
        title={title}
        passage={passageContent}
        questions={questions}
        onAnswerChange={handleAnswerChange}
        userAnswers={userAnswers}
      />
    </div>
  );
};

export default ReadingPart1Example;
