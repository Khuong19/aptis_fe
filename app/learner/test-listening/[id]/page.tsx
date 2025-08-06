"use client";
import LearnerListeningTestView from "@/app/components/learner/tests/LearnerListeningTestView";
import { LearnerTestsService } from "@/app/lib/api/learnerTestsService";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// Mock data for testing LearnerListeningTestView
const mockListeningTest = {
  id: "listening-test-1",
  title: "APTIS Listening Test",
  type: "listening",
  duration: 1500, // 25 minutes in seconds
  data: {
    questionSets: [
      // Part 1: Multiple choice with audio
      {
        id: "listening-part-1",
        part: 1,
        title: "Listening Part 1",
        audioUrl: "/audio/traffic-report.mp3",
        instructions:
          "Listen to a reporter talking about traffic problems. What was the main cause of morning traffic?",
        questions: [
          {
            id: "q1",
            text: "What was the main cause of morning traffic?",
            question: "What was the main cause of morning traffic?",
            options: {
              A: "A new road system",
              B: "A public holiday",
              C: "Increased car ownership",
            },
          },
        ],
      },
      {
        id: "listening-part-1",
        part: 1,
        title: "Listening Part 1",
        audioUrl: "/audio/traffic-report.mp3",
        instructions:
          "Listen to a reporter talking about traffic problems. What was the main cause of morning traffic?",
        questions: [
          {
            id: "q1",
            text: "What was the main cause of morning traffic?",
            question: "What was the main cause of morning traffic?",
            options: {
              A: "A new road system",
              B: "A public holiday",
              C: "Increased car ownership",
            },
          },
        ],
      },

      // Part 2: Sentence completion with dropdowns
      {
        id: "listening-part-2",
        part: 2,
        title: "Listening Part 2",
        audioUrl: "/audio/science-discussion.mp3",
        instructions:
          "Four people are talking about science. Complete the sentences below.",
        questions: [
          {
            id: "q1",
            text: "Speaker A ...",
            options: {
              option1: "believes science is important for society",
              option2: "thinks science education needs improvement",
              option3: "supports more funding for research",
            },
          },
          {
            id: "q2",
            text: "Speaker B ...",
            options: {
              option1: "disagrees with current scientific methods",
              option2: "wants more practical applications",
              option3: "emphasizes theoretical knowledge",
            },
          },
          {
            id: "q3",
            text: "Speaker C ...",
            options: {
              option1: "focuses on environmental issues",
              option2: "prefers traditional approaches",
              option3: "advocates for innovation",
            },
          },
          {
            id: "q4",
            text: "Speaker D ...",
            options: {
              option1: "questions scientific ethics",
              option2: "supports interdisciplinary studies",
              option3: "emphasizes peer review",
            },
          },
        ],
      },

      // Part 3: Opinion matching
      {
        id: "listening-part-3",
        part: 3,
        title: "Listening Part 3",
        audioUrl: "/audio/parents-discussion.mp3",
        instructions:
          "Listen to two parents discussing the issue of children's health. Read the opinions below and decide whose opinion matches the statements: the man, the woman, or both the man and the woman. You can listen to the discussion twice.",
        questions: [
          {
            id: "q1",
            text: "Parents should better manage their children's diets.",
            question: "Parents should better manage their children's diets.",
          },
          {
            id: "q2",
            text: "Parents should support their child's interest in sport.",
            question: "Parents should support their child's interest in sport.",
          },
          {
            id: "q3",
            text: "Quiet time can promote children's concentration abilities.",
            question:
              "Quiet time can promote children's concentration abilities.",
          },
          {
            id: "q4",
            text: "Excessive sleep can be bad for young people.",
            question: "Excessive sleep can be bad for young people.",
          },
        ],
      },

      // Part 4: Multiple choice with multiple questions
      {
        id: "listening-part-4",
        part: 4,
        title: "Listening Part 4",
        audioUrl: "/audio/city-planner.mp3",
        instructions:
          "Listen to a city planner talk at a press conference about a new transport plan and answer the questions below.",
        questions: [
          {
            id: "q1",
            text: "What is his opinion of the plan overall?",
            question: "What is his opinion of the plan overall?",
            options: {
              A: "It is very similar to previous community projects in the same area.",
              B: "It was prepared without proper consultation with the community.",
              C: "It does not represent the opinions of the whole community.",
            },
          },
          {
            id: "q2",
            text: "What is his opinion of the role of the media?",
            question: "What is his opinion of the role of the media?",
            options: {
              A: "He is critical of the media's reporting of the plan.",
              B: "He is surprised by the media's interest in the plan.",
              C: "He is confused by the media's reaction to the plan.",
            },
          },
        ],
      },
    ],
  },
};

// Usage example in a React component or test file:
export default function TestListeningComponent() {
  const [test, setTest] = useState(mockListeningTest);
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const { id } = params as { id: string };
  useEffect(() => {
    const fetchTest = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const data = await LearnerTestsService.getTestById(id);
        setTest(data.data);
      } catch (error) {
        console.error("Failed to fetch test:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTest();
  }, [id]);
  const handleTestComplete = (
    answers: Record<string, string>,
    timeSpent: number
  ) => {
    console.log("Test completed!");
    console.log("Answers:", answers);
    console.log("Time spent:", timeSpent, "seconds");
  };

  return (
    <LearnerListeningTestView test={test} onTestComplete={handleTestComplete} />
  );
}
