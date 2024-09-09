import type { Language } from '@/extensions/Ai';

export type EditorUser = {
  clientId: string;
  name: string;
  color: string;
  initials?: string;
};

export type LanguageOption = {
  name: string;
  label: string;
  value: Language;
};

export type AiTone =
  | 'academic'
  | 'business'
  | 'casual'
  | 'childfriendly'
  | 'conversational'
  | 'emotional'
  | 'humorous'
  | 'informative'
  | 'inspirational'
  | string;

export type AiToneOption = {
  name: string;
  label: string;
  value: AiTone;
};
