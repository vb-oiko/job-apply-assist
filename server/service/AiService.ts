import { OpenAIApi } from "openai";
import { z } from "zod";
import { GptModelStrategy, TurboStrategy } from "../utils/GptModelStrategy";
import { PromptService, CoverLetterParams } from "./PromptService";

export const JobInfo = z.object({
  title: z.string(),
  company: z.string(),
  reasons: z.string(),
  city: z.string(),
});

export type JobInfo = z.infer<typeof JobInfo>;

export class AiService {
  constructor(
    private readonly openAi: OpenAIApi,
    private readonly promptService: PromptService,
    private readonly gptModelStrategy: GptModelStrategy = new TurboStrategy()
  ) {}

  public async extractJobInfo(description: string): Promise<JobInfo> {
    const prompt = await this.promptService.getExtractJobInfoPrompt({
      description,
    });

    const text = await this.gptModelStrategy.complete(this.openAi, prompt);

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

    return await this.gptModelStrategy.complete(this.openAi, prompt);
  }

  public async getCoverLetterText(params: CoverLetterParams): Promise<string> {
    const prompt = await this.promptService.getCoverLetterPrompt(params);

    return await this.gptModelStrategy.complete(this.openAi, prompt);
  }
}
