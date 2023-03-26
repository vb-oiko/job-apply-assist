import { OpenAIApi } from "openai";
import { z } from "zod";
import { PromptCollection } from "../collection/PromptCollection";

export const TitleAndCompany = z.object({
  title: z.string(),
  company: z.string(),
});

export type TitleAndCompany = z.infer<typeof TitleAndCompany>;

export class AiService {
  constructor(
    private readonly promptCollection: PromptCollection,
    private readonly openAi: OpenAIApi
  ) {}

  public async extractPositionAndCompany(
    description: string
  ): Promise<TitleAndCompany> {
    const rawPrompt = await this.promptCollection.getMostRecent(
      "extract_job_title_and_position"
    );

    const prompt = rawPrompt.prompt.replaceAll(
      "{job_description}",
      description
    );

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

    const validationResult = TitleAndCompany.safeParse(JSON.parse(text));

    if (!validationResult.success) {
      throw new Error("Invalid response");
    }

    return validationResult.data;
  }
}
