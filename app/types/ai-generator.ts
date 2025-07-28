// frontend/app/types/ai-generator.ts

// frontend/app/types/ai-generator.ts

export interface BaseQuestion {
  id: string;
  text: string;
  answer: string;
}

export interface Part1Question extends BaseQuestion {
  part: 1;
  options: { A: string; B: string; C: string; };
  passage?: string;
}

export interface Part2Question extends BaseQuestion {
  part: 2;
  position: number;
  sentence: string;
}

export interface Part3Question extends BaseQuestion {
  part: 3;
  options: { A: string; B: string; C: string; D: string; };
  correctPerson: string;
}

export interface Part4Question extends BaseQuestion {
  part: 4;
  options: { A: string; B: string; C: string; D: string; E?: string; F?: string; };
  paragraph: string;
}

export type Question = Part1Question | Part2Question | Part3Question | Part4Question;

// Type guards
export const isPart1Question = (q: Question): q is Part1Question => 'options' in q && q.part === 1;
export const isPart2Question = (q: Question): q is Part2Question => 'sentence' in q && q.part === 2;
export const isPart3Question = (q: Question): q is Part3Question => 'correctPerson' in q && q.part === 3;
export const isPart4Question = (q: Question): q is Part4Question => 'paragraph' in q && q.part === 4;

