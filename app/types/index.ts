// User Types
export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  avatar?: string;
  status: 'active' | 'inactive';
  lastLogin?: string;
  createdAt: string;
}

// Test Types
export type TestStatus = 'published' | 'draft';

export interface Test {
  id: string;
  title: string;
  description: string;
  type: 'Reading' | 'Listening';
  status: 'Draft' | 'Published';
  duration: number;
  questions: number;
  createdAt: string;
  updatedAt: string;
}

// Stats Types
export interface StatsCard {
  title: string;
  value: number | string;
  change?: number;
  icon: string;
}

// Chart Types
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}

export interface TeacherProfile {
  id: string;
  name: string;
  email: string;
  totalTests: number;
  avatar?: string;
}

export interface AIGeneratorOptions {
  format: 'APTIS' | 'EOS' | 'Other';
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  topic?: string;
}

export interface LearnerProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  completedTests: number;
  inProgressTests: number;
}

export interface LearnerTest {
  id: string;
  title: string;
  description?: string;
  type: 'reading' | 'listening';
  status: 'Draft' | 'Published';
  duration: number;
  questions?: number;
  totalQuestions?: number;
  lastAttempt?: string;
  createdAt?: string;
  authorName?: string;
  questionSets?: any[];
}

export interface TestResult {
  id: string;
  testId: string;
  testTitle: string;
  type: 'Reading' | 'Listening';
  score: number;
  dateTaken: string;
  timeSpent: number;
  correctAnswers: number;
  totalQuestions: number;
}

export interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  type: 'Reading' | 'Listening' | 'Grammar' | 'Vocabulary';
  format: 'PDF' | 'Audio' | 'Video' | 'ZIP';
  publishedAt: string;
  fileSize: string;
  downloadUrl: string;
  thumbnail?: string;
} 