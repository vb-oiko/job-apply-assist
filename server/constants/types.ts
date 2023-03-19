export type RawPositionInsertObject = Omit<RawPosition, "id">;

export type Position = RawPosition | ParsedPosition | GeneratedPosition;

export interface RawPosition {
  url: string;
  description: string;
  id: string;
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
