/**
 * Question Bank Types
 * Shared interfaces for question bank components
 */

export interface QuestionOption {
  text: string;
  isCorrect: boolean;
}

// For Reading Part 3, represents one of the texts to match against.
export interface Passage {
  id: string;
  person: string; // e.g., 'A', 'B', 'C', 'D'
  text: string;
  content?: string; // Alternative field name for backward compatibility
}

export interface Question {
  id: string;
  text: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
    E?: string; // Optional for Part 2 matching format
    F?: string; // Optional for Part 2 matching format
  } | QuestionOption[];
  answer?: string; // 'A', 'B', 'C', 'D', 'E', or 'F'
  correctPerson?: string; // For Reading Part 3, stores which person ('A', 'B', etc.) is the correct answer
  user_id?: string; // ID of the user who created this question
  createdBy?: string; // Name of the user who created this question
  sentences?: any[]; // For Reading Part 2 - array of sentence objects
}

export interface Paragraph {
  id: string;
  text: string;
  isExample?: boolean;
  correctHeadingId?: string;
}

export interface Heading {
  id: string;
  text: string;
}

export interface ListeningConversation {
  id?: string;
  title?: string;
  context?: string;
  participants?: string[];
  audioText?: string;
  questions?: Question[];
}

export interface ListeningMonologue {
  id?: string;
  title?: string;
  topic?: string;
  speaker?: string;
  audioText?: string;
  questions?: Question[];
}

export interface ListeningSpeaker {
  id?: string;
  name?: string;
  opinion?: string;
  audioText?: string;
}

export interface ListeningDiscussionTurn {
  speaker: 'Man' | 'Woman';
  text: string;
}

export interface ListeningLecture {
  id: string;
  topic: string;
  speaker: string;
  audioText: string;
  questions: Question[];
}

export interface QuestionSet {
  id: string;
  title: string;
  part: number;
  level?: 'A2' | 'A2+' | 'B1' | 'B2' | 'C1' | 'mixed';
  questions: Question[];
  authorId: string;
  authorName: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  type: 'reading' | 'listening';
  source?: 'official' | 'ai-generated' | 'manual'; // To distinguish between official and AI-generated questions
  content?: string; // Reading passage content
  passageText?: string; // For Reading Part 1 (gap-fill) and Part 2 (sentence ordering JSON)
  passages?: Passage[]; // For Reading Part 3 (multiple passages for matching)
  paragraphs?: Paragraph[]; // For Reading Part 4
  headings?: Heading[]; // For Reading Part 4
  passage?: string; // For Reading Part 4 - main passage content
  // Listening-specific properties
  conversations?: ListeningConversation[]; // For Part 1
  monologue?: ListeningMonologue; // For Part 2
  speakers?: ListeningSpeaker[]; // For Part 3
  discussion?: ListeningDiscussionTurn[]; // For Part 3 (discussion format)
  lectures?: ListeningLecture[]; // For Part 4 (lecture format)
  audioFiles?: string[]; // Audio file paths
}

export interface Comment {
  id: string;
  questionSetId: string;
  authorId: string;
  authorName: string;
  text: string;
  createdAt: string;
}
