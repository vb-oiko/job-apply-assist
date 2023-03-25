import { z } from "zod";
import { TRPCInstance } from "..";
import { PromptCollection } from "../collection/PromptCollection";
import { Prompt, PROMPTS, PromptType } from "../constants/types";

export const listPromptRequest = z.object({
  offset: z.number().optional(),
  limit: z.number().optional(),
});

export const createPromptRequest = z.object({
  type: z.enum(PROMPTS),
  prompt: z.string(),
});

export const getPromptTypesRequest = z.undefined();

export default class PromptController {
  constructor(
    private readonly trpcInstance: TRPCInstance,
    private readonly promptCollection: PromptCollection
  ) {}

  listPrompts() {
    return this.trpcInstance.procedure
      .input(listPromptRequest)
      .query(async ({ input }): Promise<ListPromptsResponse> => {
        return { prompts: await this.promptCollection.listAll() };
      });
  }

  createPrompt() {
    return this.trpcInstance.procedure
      .input(createPromptRequest)
      .mutation(async ({ input }): Promise<CreatePromptResponse> => {
        const id = await this.promptCollection.insert(input);
        return { id };
      });
  }

  getPromptTypes() {
    return this.trpcInstance.procedure
      .input(getPromptTypesRequest)
      .query(async (): Promise<GetPromptTypesResponse> => {
        return PROMPTS;
      });
  }
}

export type CreatePromptResponse = {
  id: string;
};

export type ListPromptsResponse = {
  prompts: Prompt[];
};

export type GetPromptTypesResponse = typeof PROMPTS;
