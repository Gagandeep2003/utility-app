export type Category =
  | 'math'
  | 'everyday'
  | 'student'
  | 'career'
  | 'money'
  | 'developer'
  | 'exams';

export type ToolCategory = Category;

export type FieldType = 'number' | 'text' | 'textarea' | 'select' | 'date' | 'datetime-local';

export interface ToolField {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  unit?: string;
  defaultValue?: string;
  options?: { label: string; value: string }[];
  required?: boolean;
  min?: number;
  max?: number;
  step?: string;
  helperText?: string;
}

export type ResultDisplayType =
  | 'numeric'
  | 'currency'
  | 'percent'
  | 'text'
  | 'date'
  | 'duration'
  | 'table'
  | 'formula'
  | 'html'
  | 'list';

export interface ResultColumn {
  key: string;
  label: string;
  type?: ResultDisplayType;
  unit?: string;
}

export interface ResultRow {
  [key: string]: string | number | null;
}

export interface ToolResultValue {
  label: string;
  value: string | number;
  unit?: string;
  type?: ResultDisplayType;
  highlight?: boolean;
}

export interface ToolResult {
  heading?: string;
  values: ToolResultValue[];
  table?: {
    columns: ResultColumn[];
    rows: ResultRow[];
  };
  breakdown?: { label: string; value: string }[];
}

export interface WorkedExample {
  title: string;
  inputs: { label: string; value?: string }[];
  result: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ToolDefinition {
  id: string;
  slug: string;
  category: Category;
  title: string;
  shortDescription: string;
  keywords: string[];
  aliases?: string[];
  faq?: FAQItem[];
  computation: string;
  needsClient: boolean;
  commercialIntent: 'low' | 'medium' | 'high';
  adProfile?: 'default' | 'minimal' | 'aggressive';
  affiliateProfile?: string;
  sponsorProfile?: string;
  externalData?: boolean;
  deprecated?: boolean;
  source?: { name: string; url: string; effectiveDate?: string };
  ogImage?: string;
  lastReviewed?: string;
  formula: string;
  explanation: string;
  examples: WorkedExample[];
  assumptions?: string;
  relatedTools: string[];
  tags?: string[];
}

export const CATEGORY_LABELS: Record<Category, string> = {
  math: 'Math',
  everyday: 'Everyday',
  student: 'Student',
  career: 'Career',
  money: 'Money',
  developer: 'Developer',
  exams: 'Exams',
};

export const CATEGORY_DESCRIPTIONS: Record<Category, string> = {
  math: 'Percentage, fraction, ratio, interest, probability, and general math calculators.',
  everyday: 'Age, dates, time zones, unit conversions, and everyday utility tools.',
  student: 'CGPA, GPA, marks percentage, attendance, grade, and exam score calculators.',
  career: 'Salary increment, comparison, CTC, hike, notice period, and leave calculators.',
  money: 'EMI, loan, SIP, FD, RD, GST, inflation, and financial planning calculators.',
  developer: 'JSON, Base64, URL encoding, UUID, JWT, regex, color conversion, and code utilities.',
  exams: 'SSC and exam-specific calculators with verified marking schemes and references.',
};
