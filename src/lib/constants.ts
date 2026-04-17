export type SectionType = 'LISTENING_TEXT' | 'LISTENING_IMAGE' | 'LISTENING_LONG' | 'READING_SIGNS' | 'READING_SENTENCE' | 'READING_FILL_BLANK' | 'READING_COMPREHENSION';

export const VALID_SECTION_TYPES: SectionType[] = [
  'LISTENING_TEXT', 'LISTENING_IMAGE', 'LISTENING_LONG', 'READING_SIGNS',
  'READING_SENTENCE', 'READING_FILL_BLANK', 'READING_COMPREHENSION',
];

export const TYPE_BADGE: Record<string, { label: string; cls: string }> = {
  LISTENING_TEXT:        { label: 'Listening Text',  cls: 'badge-listening-text' },
  LISTENING_IMAGE:       { label: 'Listening Image', cls: 'badge-listening-image' },
  LISTENING_LONG:        { label: 'Listening Long',  cls: 'badge-listening-long' },
  READING_SIGNS:         { label: 'Reading Signs',   cls: 'badge-reading-signs' },
  READING_SENTENCE:      { label: 'Sentence Fill',   cls: 'badge-reading-sentence' },
  READING_FILL_BLANK:    { label: 'Fill Blank',      cls: 'badge-reading-fill' },
  READING_COMPREHENSION: { label: 'Comprehension',   cls: 'badge-reading-comp' },
};
