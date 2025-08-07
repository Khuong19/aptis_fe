"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import LearnerListeningTestView from "@/app/components/learner/tests/LearnerListeningTestView";
import LearnerListeningTestResult from "@/app/components/learner/tests/LearnerListeningTestResult";
import { LearnerTestsService } from "@/app/lib/api/learnerTestsService";

export default function TestListeningComponent() {
  const [test, setTest] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [testAnswers, setTestAnswers] = useState<Record<string, string>>({});
  const [testTimeSpent, setTestTimeSpent] = useState(0);
  
  const params = useParams();
  const router = useRouter();
  const { id } = params as { id: string };

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

  const handleTestComplete = (
    answers: Record<string, string>,
    timeSpent: number
  ) => {
    console.log("Test completed!");
    console.log("Answers:", answers);
    console.log("Time spent:", timeSpent, "seconds");
    
    setTestAnswers(answers);
    setTestTimeSpent(timeSpent);
    setIsTestComplete(true);
  };

  const handleRetake = () => {
    setIsTestComplete(false);
    setTestAnswers({});
    setTestTimeSpent(0);
  };

  const handleBackToTests = () => {
    router.push('/learner/practice');
  };

  // Load test data
  useEffect(() => {
    fetchTest();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading test...</p>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Test not found</p>
        </div>
      </div>
    );
  }

  if (isTestComplete) {
    return (
      <LearnerListeningTestResult
        test={test}
        answers={testAnswers}
        timeSpent={testTimeSpent}
        onRetake={handleRetake}
        onBackToTests={handleBackToTests}
      />
    );
  }

  return (
    <LearnerListeningTestView 
      test={test} 
      onTestComplete={handleTestComplete} 
    />
  );
}
