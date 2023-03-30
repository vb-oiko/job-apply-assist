import { OpenAIApi } from "openai";

const MODELS = ["text-davinci-003", "gpt-3.5-turbo", "gpt-4"] as const;
export type Model = typeof MODELS[number];

export abstract class GptModelStrategy {
  public async complete(openAi: OpenAIApi, prompt: string): Promise<string> {
    throw new Error("Not implemented");
  }

  protected static async getChatCompletion(
    openAi: OpenAIApi,
    prompt: string,
    model: Model
  ) {
    console.log("calling Open AI API");
    const response = await openAi.createChatCompletion({
      model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2048,
      temperature: 0,
      n: 1,
    });

    if (!response.data.choices.length) {
      throw new Error("Empty response");
    }

    console.log("completion finished");

    const text = response.data.choices[0].message?.content;

    console.warn(text);

    if (!text) {
      throw new Error("Empty response");
    }

    return text;
  }

  protected static async getCompletion(
    openAi: OpenAIApi,
    prompt: string,
    model: Model
  ) {
    console.log("calling Open AI API");
    const response = await openAi.createCompletion({
      model,
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
}

export class DavinciStrategy extends GptModelStrategy {
  public async complete(openAi: OpenAIApi, prompt: string): Promise<string> {
    return await DavinciStrategy.getCompletion(
      openAi,
      prompt,
      "text-davinci-003"
    );
  }
}

export class TurboStrategy extends GptModelStrategy {
  public async complete(openAi: OpenAIApi, prompt: string): Promise<string> {
    return await TurboStrategy.getChatCompletion(
      openAi,
      prompt,
      "gpt-3.5-turbo"
    );
  }
}

export class Gpt4Strategy extends GptModelStrategy {
  public async complete(openAi: OpenAIApi, prompt: string): Promise<string> {
    return await Gpt4Strategy.getChatCompletion(openAi, prompt, "gpt-4");
  }
}
