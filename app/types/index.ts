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
  status: 'Draft' | 'Public';
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
  type: 'Reading' | 'Listening' | 'Grammar';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  status: 'New' | 'In Progress' | 'Completed';
  duration: number; // minutes
  questions: number;
  thumbnail?: string;
  progress?: number; // percentage
  lastAttempt?: string; // ISO date string
}

export interface TestResult {
  id: string;
  testId: string;
  testTitle: string;
  type: 'Reading' | 'Listening' | 'Grammar';
  score: number; // percentage
  dateTaken: string; // ISO date string
  timeSpent: number; // minutes
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