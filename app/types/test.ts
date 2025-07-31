export type TestType = 'Reading' | 'Listening' | 'Grammar';

export interface TestResult {
  id: string;
  testId: string;
  testTitle: string;
  type: TestType;
  score: number;
  dateTaken: string;
  timeSpent: number;
  correctAnswers: number;
  totalQuestions: number;
}
