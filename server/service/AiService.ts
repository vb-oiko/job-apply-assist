import { OpenAIApi } from "openai";
import { z } from "zod";
import { PromptService, CoverLetterParams } from "./PromptService";

export const JobInfo = z.object({
  title: z.string(),
  company: z.string(),
  reasons: z.string(),
});

export type JobInfo = z.infer<typeof JobInfo>;

export class AiService {
  constructor(
    private readonly openAi: OpenAIApi,
    private readonly promptService: PromptService
  ) {}

  private async getCompletion(prompt: string) {
    console.log("calling Open AI API");
    const response = await this.openAi.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 2048,
      temperature: 0,
      n: 1,
    });

    if (!response.data.choices.length) {
      throw new Error("Empty response");
    }

    console.log("completion finished");

    const { text } = response.data.choices[0];

    if (!text) {
      throw new Error("Empty response");
    }

    return text;
  }

  public async extractJobInfo(description: string): Promise<JobInfo> {
    const prompt = await this.promptService.getExtractJobInfoPrompt({
      description,
    });

    const text = await this.getCompletion(prompt);

    const validationResult = JobInfo.safeParse(JSON.parse(text));

    if (!validationResult.success) {
      throw new Error("Invalid response");
    }

    return validationResult.data;
  }

  public async getMatchingPoints(description: string): Promise<string> {
    const resume = await this.promptService.getResume();

    const prompt = await this.promptService.getMatchingPointsPrompt({
      description,
      resume,
    });

    return await this.getCompletion(prompt);
  }

  public async getCoverLetter(params: CoverLetterParams): Promise<string> {
    const prompt = await this.promptService.getCoverLetterPrompt(params);

    return await this.getCompletion(prompt);
  }

  public async mockExtractJobInfo(description: string): Promise<JobInfo> {
    const prompt = await this.promptService.getExtractJobInfoPrompt({
      description,
    });

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          title: "Software Engineer",
          company: "Google",
          reasons: "reason 1, reason 2, reason 3",
        });
      }, 1000);
    });
  }
}
