import { OpenAIApi } from "openai";
import { z } from "zod";
import { PromptService } from "./PromptService";

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

  public async extractPositionAndCompany(
    description: string
  ): Promise<JobInfo> {
    const prompt = await this.promptService.getExtractJobInfoPrompt({
      description,
    });

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

    console.warn(`"${text}"`);

    debugger;

    const validationResult = JobInfo.safeParse(JSON.parse(text));

    if (!validationResult.success) {
      throw new Error("Invalid response");
    }

    return validationResult.data;
  }

  public async mockExtractPositionAndCompany(
    description: string
  ): Promise<JobInfo> {
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
