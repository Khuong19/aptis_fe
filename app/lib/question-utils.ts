import { Question } from '@/app/types/ai-generator';

export const createEmptyQuestion = (partNum: number, index: number): Question => {
  const baseId = `q-${Date.now()}-${index}`;
  switch(partNum) {
    case 1: return { id: baseId, part: 1, text: `Gap ${index + 1}`, options: { A: '', B: '', C: '' }, answer: 'A', passage: index === 0 ? 'Full passage...' : undefined };
    case 2: return { id: baseId, part: 2, text: `Sentence ${index + 1}`, sentence: '', position: index + 1, answer: `${index + 1}` };
    case 3: return { id: baseId, part: 3, text: `Statement ${index + 1}`, options: { A: 'Person A', B: 'Person B', C: 'Person C', D: 'Person D' }, answer: 'A', correctPerson: 'A' };
    case 4: return { id: baseId, part: 4, text: `Paragraph ${index + 1}`, options: { A: '', B: '', C: '', D: '' }, answer: 'A', paragraph: '' };
    default: throw new Error(`Invalid part number: ${partNum}`);
  }
};
