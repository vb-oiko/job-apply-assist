import { Collection, MongoClient } from "mongodb";
import { COLLECTIONS, DB_NAME, PromptType } from "../constants/constants";
import { Prompt } from "../constants/types";
import { nanoid } from "nanoid";

export class PromptCollection {
  private collection: Collection<Prompt>;

  constructor(private readonly mongoClient: MongoClient) {
    this.collection = this.mongoClient
      .db(DB_NAME)
      .collection<Prompt>(COLLECTIONS.PROMPTS);
  }

  public async getByType(type: PromptType): Promise<string | null> {
    const prompt = await this.collection.findOne({ type });
    return prompt?.prompt ?? null;
  }

  public async insert(type: PromptType, prompt: string): Promise<void> {
    await this.collection.insertOne({
      _id: nanoid(),
      type,
      prompt,
      created: new Date(),
    });
  }

  public async upsert(type: PromptType, prompt: string): Promise<void> {
    await this.collection.updateOne(
      { type },
      { 
        $set: { 
          prompt,
          updated: new Date()
        },
        $setOnInsert: {
          _id: nanoid(),
          created: new Date()
        }
      },
      { upsert: true }
    );
  }

  public async delete(type: PromptType): Promise<void> {
    await this.collection.deleteOne({ type });
  }
}
