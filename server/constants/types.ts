import { z } from "zod";
import { GDocServiceConfig } from "../service/GDocService";
import { ConfigurationParameters } from "openai";
import { ObjectId } from "mongodb";
import { PromptType, PROMPTS } from "./constants";

export const Question = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.optional(z.string()),
});

export type Question = z.infer<typeof Question>;

export type RawPosition = z.infer<typeof RawPosition>;

export const RawPosition = z.object({
  created: z.date(),
  url: z.string(),
  description: z.string(),
  _id: z.string(),
  questions: z.optional(z.array(Question)),
  type: z.literal("raw"),
  userId: z.string(),
});

export type ParsedPosition = z.infer<typeof ParsedPosition>;

export const ParsedPosition = RawPosition.merge(
  z.object({
    title: z.string(),
    company: z.string(),
    reasons: z.array(z.string()),
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
  userId: true,
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

export const Prompt = z.object({
  _id: z.string(),
  created: z.date(),
  type: z.enum(Object.values(PROMPTS) as [string, ...string[]]),
  prompt: z.string(),
  updated: z.date().optional(),
});

export type Prompt = z.infer<typeof Prompt>;

export type TrpcContext = {
  isAuthenticated: boolean;
  userId?: string;
};

export interface JwtConfig {
  secret: string;
}

export interface Config {
  mongoDb: {
    connectUri: string;
  };
  openai: ConfigurationParameters;
  google: GDocServiceConfig;
  jwt: JwtConfig;
}

export const User = z.object({
  _id: z.string(),
  created: z.date(),
  login: z.string(),
  hash: z.string(),
});

export type User = z.infer<typeof User>;

export const UserCredentials = z.object({
  login: z.string(),
  password: z.string(),
});

export type UserCredentials = z.infer<typeof UserCredentials>;

export const JwtData = z.object({
  userId: z.string(),
});

export type JwtData = z.infer<typeof JwtData>;
