import path from "path";
import fs from "fs";

const PROMPT_FILE_PATH = "./prompts";

enum PromptType {
  EXTRACT_JOB_INFO = "extract_job_info",
  GET_MATCHING_POINTS = "get_matching_points",
  GET_OBJECTIVE = "get_objective",
  GET_COVER_LETTER = "get_cover_letter",
  RESUME = "resume",
  NAME = "name",
  ADDITIONAL_QUESTION = "additional_question",
}

export interface CoverLetterParams extends Record<string, string> {
  title: string;
  company: string;
  reasons: string;
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
  private baseDir: string;

  constructor() {
    this.baseDir = path.resolve(PROMPT_FILE_PATH);
  }

  private async getPrompt(promptType: PromptType): Promise<string> {
    return new Promise<string>((resolve) => {
      const filePath = path.resolve(this.baseDir, promptType);

      fs.readFile(`${filePath}.txt`, "utf8", (err, fileContent) => {
        if (err) {
          throw err;
        }

        resolve(fileContent);
      });
    });
  }

  private insertValuesIntoPrompt(
    prompt: string,
    values: Record<string, string>
  ) {
    let result = prompt;

    Object.entries(values).forEach(([key, value]) => {
      result = result.replaceAll(`{${key}}`, value);
    });

    return result;
  }

  public async getExtractJobInfoPrompt(params: JobDescriptionParams) {
    return this.insertValuesIntoPrompt(
      await this.getPrompt(PromptType.EXTRACT_JOB_INFO),
      params
    );
  }

  public async getMatchingPointsPrompt(params: MatchingPointsParams) {
    return this.insertValuesIntoPrompt(
      await this.getPrompt(PromptType.GET_MATCHING_POINTS),
      params
    );
  }

  public async getObjectivePrompt(params: ObjectiveParams) {
    return this.insertValuesIntoPrompt(
      await this.getPrompt(PromptType.GET_OBJECTIVE),
      params
    );
  }

  public async getAdditionalQuestionPrompt(params: AdditionalQuestionParams) {
    return this.insertValuesIntoPrompt(
      await this.getPrompt(PromptType.ADDITIONAL_QUESTION),
      params
    );
  }

  public async getCoverLetterPrompt(params: CoverLetterParams) {
    return this.insertValuesIntoPrompt(
      await this.getPrompt(PromptType.GET_COVER_LETTER),
      { ...params, name: await this.getName() }
    );
  }

  public async getResume() {
    return this.getPrompt(PromptType.RESUME);
  }

  public async getName() {
    return this.getPrompt(PromptType.NAME);
  }
}
