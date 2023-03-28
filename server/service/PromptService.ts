import path from "path";
import fs from "fs";

const PROMPT_FILE_PATH = "./prompts";

enum PromptType {
  EXTRACT_JOB_INFO = "extract_job_info",
  GET_MATCHING_POINTS = "get_matching_points",
  GET_COVER_LETTER = "get_cover_letter",
}

export class PromptService {
  private baseDir: string;

  constructor() {
    this.baseDir = path.resolve(PROMPT_FILE_PATH);
  }

  private async getPrompt(type: PromptType): Promise<string> {
    return new Promise<string>((resolve) => {
      const filePath = path.resolve(this.baseDir, PromptType.EXTRACT_JOB_INFO);

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

  public async getExtractJobInfoPrompt(values: Record<string, string>) {
    return this.insertValuesIntoPrompt(
      await this.getPrompt(PromptType.EXTRACT_JOB_INFO),
      values
    );
  }

  public async getMatchingPoints(values: Record<string, string>) {
    return this.insertValuesIntoPrompt(
      await this.getPrompt(PromptType.GET_MATCHING_POINTS),
      values
    );
  }

  public async getCoverLetter(values: Record<string, string>) {
    return this.insertValuesIntoPrompt(
      await this.getPrompt(PromptType.GET_COVER_LETTER),
      values
    );
  }
}
