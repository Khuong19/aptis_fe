/**
 * Types related to tests in the application
 */

/**
 * Represents a question in a reading test
 */
export interface Question {
  prompt: string;
  options?: string[];
  answer: string;
}

/**
 * Represents a complete reading test
 */
export interface ReadingTest {
  title: string;
  text: string;
  questions: Question[];
  part: number;
  level: string;
  type: string;
  metadata?: {
    generatedBy?: string;
    timestamp?: string;
    topic?: string;
  };
}
