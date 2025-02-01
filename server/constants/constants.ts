export const SERVER_PORT = 2022;

export const DB_NAME = "job_apply_assist";

export const COLLECTIONS = {
  PROMPTS: "prompts",
  POSITIONS: "positions",
  USERS: "users",
} as const;

export type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS];

export const PROMPTS = {
  EXTRACT_JOB_INFO: "extract_job_info",
  GET_MATCHING_POINTS: "get_matching_points",
  GET_OBJECTIVE: "get_objective",
  GET_COVER_LETTER: "get_cover_letter",
  RESUME: "resume",
  NAME: "name",
  ADDITIONAL_QUESTION: "additional_question",
} as const;

export type PromptType = typeof PROMPTS[keyof typeof PROMPTS];
