export type RawPositionInsertObject = Omit<RawPosition, "_id" | "created">;

export type Position = RawPosition | ParsedPosition | GeneratedPosition;

export interface RawPosition {
  created: Date;
  url: string;
  description: string;
  _id: string;
  type: "raw";
}

export interface ParsedPosition extends Omit<RawPosition, "type"> {
  position: string;
  company: string;
  reasons: string;
  matchingPoints: string;
  type: "parsed";
}

export interface GeneratedPosition extends Omit<ParsedPosition, "type"> {
  resumeGDocId: string;
  coverLetterGDocId: string;
  type: "generated";
}

const PROMPTS = [
  "generate_cover_letter",
  "extract_job_title_and_position",
  "get_matching_points",
  "get_reasons",
] as const;

export type PromptType = typeof PROMPTS[number];

export interface Prompt {
  _id: string;
  created: Date;
  type: PromptType;
  prompt: string;
}

export type PromptInsertObject = Omit<Prompt, "_id" | "created">;
