import { MongoClient } from "mongodb";
import { Prompt, PromptType } from "../constants/types";

export class PromptService {
  constructor(private readonly mongoClient: MongoClient) {}

  public async getPrompt(type: PromptType): Promise<Prompt> {
    throw new Error("Not implemented");
  }
}
