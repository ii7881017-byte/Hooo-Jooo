export type Language = 'ar' | 'en' | 'fr' | 'es' | 'de' | 'tr';

export type ToolCategory =
  | 'all'
  | 'text'
  | 'developer'
  | 'security'
  | 'media'
  | 'converter'
  | 'finance'
  | 'math'
  | 'time'
  | 'ai';

export interface ToolItem {
  id: string;
  nameKey: string;
  descKey: string;
  category: ToolCategory;
  iconName: string;
  tags: string[];
  isPopular?: boolean;
  isNew?: boolean;
  isAiPowered?: boolean;
}

export interface LanguageInfo {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'rtl' | 'ltr';
}
