import { Collection, MongoClient } from "mongodb";
import { nanoid } from "nanoid";
import { COLLECTIONS, DB_NAME } from "../constants/constants";
import { Prompt, PromptInsertObject, PromptType } from "../constants/types";

export class PromptCollection {
  private collection: Collection<Prompt>;

  constructor(private readonly mongoClient: MongoClient) {
    this.collection = this.mongoClient
      .db(DB_NAME)
      .collection<Prompt>(COLLECTIONS.prompts);
  }

  public async listAll(): Promise<Prompt[]> {
    return await this.collection.find({}, { sort: { created: -1 } }).toArray();
  }

  public async getMostRecent(type: PromptType): Promise<Prompt> {
    const prompt = await this.collection.findOne(
      { type },
      { sort: { created: -1 } }
    );

    if (!prompt) {
      throw new Error(`Prompt not found, type: ${type}`);
    }

    return prompt;
  }

  public async insert(prompt: PromptInsertObject) {
    const result = await this.collection.insertOne({
      ...prompt,
      created: new Date(),
      _id: nanoid(),
    });

    return result.insertedId;
  }
}
