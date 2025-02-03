import { PromptCollection } from "../collection/PromptCollection";
import { PROMPTS } from "../constants/constants";
import type { PromptType } from "../constants/constants";

export interface CoverLetterParams extends Record<string, string | string[]> {
  title: string;
  company: string;
  reasons: string[];
  matchingPoints: string;
}

export interface MatchingPointsParams extends Record<string, string> {
  description: string;
  resume: string;
}

export interface ObjectiveParams extends Record<string, string> {
  description: string;
  resume: string;
}

export interface JobDescriptionParams extends Record<string, string> {
  description: string;
}

export interface AdditionalQuestionParams extends Record<string, string> {
  description: string;
  resume: string;
  question: string;
}

export class PromptService {
  constructor(private readonly promptCollection: PromptCollection) {}

  private async getPrompt(promptType: PromptType): Promise<string> {
    const prompt = await this.promptCollection.getByType(promptType);
    if (!prompt) {
      throw new Error(`Prompt not found: ${promptType}`);
    }
    return prompt;
  }

  private insertValuesIntoPrompt(
    prompt: string,
    values: Record<string, string | string[]>
  ) {
    let result = prompt;
    Object.entries(values).forEach(([key, value]) => {
      result = result.replaceAll(
        `{${key}}`,
        Array.isArray(value) ? value.join("\n") : value
      );
    });
    return result;
  }

  public async getExtractJobInfoPrompt(params: JobDescriptionParams) {
    return this.insertValuesIntoPrompt(
      await this.getPrompt(PROMPTS.EXTRACT_JOB_INFO),
      params
    );
  }

  public async getMatchingPointsPrompt(params: MatchingPointsParams) {
    return this.insertValuesIntoPrompt(
      await this.getPrompt(PROMPTS.GET_MATCHING_POINTS),
      params
    );
  }

  public async getObjectivePrompt(params: ObjectiveParams) {
    return this.insertValuesIntoPrompt(
      await this.getPrompt(PROMPTS.GET_OBJECTIVE),
      params
    );
  }

  public async getAdditionalQuestionPrompt(params: AdditionalQuestionParams) {
    return this.insertValuesIntoPrompt(
      await this.getPrompt(PROMPTS.ADDITIONAL_QUESTION),
      params
    );
  }

  public async getCoverLetterPrompt(params: CoverLetterParams) {
    return this.insertValuesIntoPrompt(
      await this.getPrompt(PROMPTS.GET_COVER_LETTER),
      { ...params, name: await this.getName() }
    );
  }

  public async getResume() {
    return this.getPrompt(PROMPTS.RESUME);
  }

  public async getName() {
    return this.getPrompt(PROMPTS.NAME);
  }
}
