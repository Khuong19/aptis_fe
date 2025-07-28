import { Test } from '../../types';

export const dummyTests: Test[] = [
  {
    id: '1',
    title: 'APTIS Grammar Test - Basic Level',
    description: 'Basic grammar test covering verb tenses, prepositions, articles, and common structures.',
    type: 'Reading',
    status: 'Public',
    createdAt: '2025-04-10T08:30:00Z',
    updatedAt: '2025-06-05T15:20:00Z',
    duration: 30,
    questions: 25,
  },
  {
    id: '2',
    title: 'APTIS Reading Comprehension - Intermediate Level',
    description: 'Intermediate reading passages with comprehension questions testing vocabulary and understanding.',
    type: 'Reading',
    status: 'Public',
    createdAt: '2025-05-15T10:45:00Z',
    updatedAt: '2025-06-10T09:30:00Z',
    duration: 45,
    questions: 20,
  },
  {
    id: '3',
    title: 'APTIS Writing Skills - Advanced Level',
    description: 'Advanced writing prompts focusing on essay structures, argumentation, and formal writing.',
    type: 'Reading',
    status: 'Draft',
    createdAt: '2025-06-01T14:20:00Z',
    updatedAt: '2025-06-12T11:10:00Z',
    duration: 60,
    questions: 3,
  },
  {
    id: '4',
    title: 'APTIS Listening Test - Basic Level',
    description: 'Basic listening comprehension with short dialogues and questions.',
    type: 'Listening',
    status: 'Public',
    createdAt: '2025-03-22T09:15:00Z',
    updatedAt: '2025-04-18T16:50:00Z',
    duration: 25,
    questions: 15,
  },
  {
    id: '5',
    title: 'APTIS Speaking Practice - All Levels',
    description: 'Speaking assessment with various prompts for different proficiency levels.',
    type: 'Listening',
    status: 'Draft',
    createdAt: '2025-06-08T13:30:00Z',
    updatedAt: '2025-06-14T10:20:00Z',
    duration: 20,
    questions: 5,
  },
  {
    id: '6',
    title: 'APTIS Vocabulary Builder - Intermediate Level',
    description: 'Comprehensive vocabulary assessment covering various topics and contexts.',
    type: 'Reading',
    status: 'Public',
    createdAt: '2025-05-05T11:25:00Z',
    updatedAt: '2025-06-02T14:15:00Z',
    duration: 35,
    questions: 30,
  },
  {
    id: '7',
    title: 'APTIS Full Practice Test - Intermediate Level',
    description: 'Complete practice test covering all sections: grammar, vocabulary, reading, writing, and listening.',
    type: 'Reading',
    status: 'Public',
    createdAt: '2025-04-30T08:40:00Z',
    updatedAt: '2025-05-20T15:10:00Z',
    duration: 120,
    questions: 80,
  },
  {
    id: '8',
    title: 'APTIS Business English Assessment',
    description: 'Specialized test focusing on business English vocabulary, email writing, and professional communication.',
    type: 'Listening',
    status: 'Draft',
    createdAt: '2025-06-05T16:50:00Z',
    updatedAt: '2025-06-15T11:30:00Z',
    duration: 90,
    questions: 45,
  },
];

// Helper functions
export function getTestsByStatus(status: 'Public' | 'Draft' | 'all') {
  if (status === 'all') return dummyTests;
  return dummyTests.filter(test => test.status === status);
}

export function getTestStats() {
  const total = dummyTests.length;
  const published = dummyTests.filter(test => test.status === 'Public').length;
  const draft = dummyTests.filter(test => test.status === 'Draft').length;
  
  const recentlyCreated = dummyTests.filter(
    test => new Date(test.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;
  
  return {
    total,
    published,
    draft,
    recentlyCreated
  };
} 