import { z } from "zod";

export type RawPosition = z.infer<typeof RawPosition>;

export const RawPosition = z.object({
  created: z.date(),
  url: z.string(),
  description: z.string(),
  _id: z.string(),
  type: z.literal("raw"),
});

export type ParsedPosition = z.infer<typeof ParsedPosition>;

export const ParsedPosition = RawPosition.merge(
  z.object({
    title: z.string(),
    company: z.string(),
    reasons: z.string(),
    matchingPoints: z.string(),
    objective: z.string(),
    name: z.string(),
    city: z.string(),
    type: z.literal("parsed"),
  })
);

export const GeneratedPosition = ParsedPosition.merge(
  z.object({
    resumeUrl: z.string(),
    coverLetterUrl: z.string(),
    type: z.literal("generated"),
  })
);
export type GeneratedPosition = z.infer<typeof GeneratedPosition>;

export const Position = z.discriminatedUnion("type", [
  RawPosition,
  ParsedPosition,
  GeneratedPosition,
]);

export type Position = z.infer<typeof Position>;

export const RawPositionInsertObject = RawPosition.omit({
  _id: true,
  created: true,
});

export type RawPositionInsertObject = z.infer<typeof RawPositionInsertObject>;

export const PositionUpdateObject = z.discriminatedUnion("type", [
  RawPosition.omit({ created: true, _id: true })
    .partial()
    .required({ type: true }),
  ParsedPosition.omit({ created: true }).partial().required({ type: true }),
  GeneratedPosition.omit({ created: true }).partial().required({ type: true }),
]);

export type PositionUpdateObject = z.infer<typeof PositionUpdateObject>;

export type PositionType = "raw" | "parsed" | "generated";

export const PROMPTS = [
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
