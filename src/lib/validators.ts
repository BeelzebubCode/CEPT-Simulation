const VALID_DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD'] as const;
export type Difficulty = typeof VALID_DIFFICULTIES[number];

export interface ChoiceInput {
  label: string;
  text: string;
  isCorrect: boolean;
  order: number;
  imageUrl?: string;
  blankNumber?: number;
}

export function parseChoice(c: unknown): ChoiceInput | null {
  if (typeof c !== 'object' || c === null) return null;
  const b = c as Record<string, unknown>;
  if (typeof b.label !== 'string' || b.label.trim() === '') return null;
  if (typeof b.text !== 'string') return null;
  if (typeof b.isCorrect !== 'boolean') return null;
  if (typeof b.order !== 'number' || !Number.isInteger(b.order)) return null;
  return {
    label: b.label.trim(),
    text: b.text.trim(),
    isCorrect: b.isCorrect,
    order: b.order,
    imageUrl: typeof b.imageUrl === 'string' ? b.imageUrl : undefined,
    blankNumber: typeof b.blankNumber === 'number' ? b.blankNumber : undefined,
  };
}

export function parseDifficulty(val: unknown): Difficulty {
  return VALID_DIFFICULTIES.includes(val as Difficulty) ? (val as Difficulty) : 'MEDIUM';
}

export { VALID_DIFFICULTIES };
