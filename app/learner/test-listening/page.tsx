"use client";
import LearnerListeningTestView from "@/app/components/learner/tests/LearnerListeningTestView";
import { LearnerTestsService } from "@/app/lib/api/learnerTestsService";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";


// Usage example in a React component or test file:
export default function TestListeningComponent() {
  const [test, setTest] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const { id } = params as { id: string };
  useEffect(() => {
    const fetchTest = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const data = await LearnerTestsService.getTestById(id);
        setTest(data);
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
