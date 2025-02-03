import { Configuration, ConfigurationParameters, OpenAIApi } from "openai";
import { z } from "zod";
import { GptModelStrategy, TurboStrategy } from "../utils/GptModelStrategy";
import {
  PromptService,
  CoverLetterParams,
  AdditionalQuestionParams,
} from "./PromptService";

export const JobInfo = z.object({
  title: z.string(),
  company: z.string(),
  reasons: z.array(z.string()),
  city: z.string(),
});

export const Objective = z.object({
  objective: z.string(),
});

export type JobInfo = z.infer<typeof JobInfo>;

export class AiService {
  private openAi: OpenAIApi;
  constructor(
    config: ConfigurationParameters,
    private readonly promptService: PromptService,
    private readonly gptModelStrategy: GptModelStrategy = new TurboStrategy()
  ) {
    const openAiConfiguration = new Configuration(config);
    this.openAi = new OpenAIApi(openAiConfiguration);
  }

  public async extractJobInfo(description: string): Promise<JobInfo> {
    const prompt = await this.promptService.getExtractJobInfoPrompt({
      description,
    });

    const text = await this.gptModelStrategy.complete(this.openAi, prompt);

    const validationResult = JobInfo.safeParse(JSON.parse(text));

    if (!validationResult.success) {
      console.warn(
        "AI response validation error",
        validationResult.error.errors
      );
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

  public async getObjective(description: string): Promise<string> {
    const resume = await this.promptService.getResume();

    const prompt = await this.promptService.getObjectivePrompt({
      description,
      resume,
    });

    const text = await this.gptModelStrategy.complete(this.openAi, prompt);
    console.warn({ prompt, text });

    const validationResult = Objective.safeParse(JSON.parse(text));

    if (!validationResult.success) {
      console.warn(
        "AI response validation error:",
        validationResult.error.errors
      );
      throw new Error("Invalid response");
    }

    return validationResult.data.objective;
  }

  public async getCoverLetterText(params: CoverLetterParams): Promise<string> {
    const prompt = await this.promptService.getCoverLetterPrompt(params);

    return await this.gptModelStrategy.complete(this.openAi, prompt);
  }

  public async getAnswerText(
    params: AdditionalQuestionParams
  ): Promise<string> {
    const prompt = await this.promptService.getAdditionalQuestionPrompt(params);

    return await this.gptModelStrategy.complete(this.openAi, prompt);
  }
}
