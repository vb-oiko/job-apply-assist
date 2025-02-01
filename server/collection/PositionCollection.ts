import { Collection, MongoClient } from "mongodb";
import { nanoid } from "nanoid";
import { COLLECTIONS, DB_NAME } from "../constants/constants";
import {
  Position,
  PositionUpdateObject,
  RawPositionInsertObject,
} from "../constants/types";

export class PositionCollection {
  private collection: Collection<Position>;

  constructor(private readonly mongoClient: MongoClient) {
    this.collection = this.mongoClient
      .db(DB_NAME)
      .collection<Position>(COLLECTIONS.POSITIONS);
  }

  public async listAll(userId: string): Promise<Position[]> {
    return await this.collection.find({ userId }).toArray();
  }

  public async insert(position: RawPositionInsertObject, userId: string) {
    const result = await this.collection.insertOne({
      ...position,
      created: new Date(),
      _id: nanoid(),
      userId,
    });

    return result.insertedId;
  }

  public async getById(id: string, userId: string): Promise<Position | null> {
    return this.collection.findOne({ _id: id, userId });
  }

  public async update(
    id: string,
    position: PositionUpdateObject,
    userId: string
  ) {
    await this.collection.updateOne({ _id: id, userId }, { $set: position });
  }

  public async delete(id: string, userId: string) {
    await this.collection.deleteOne({ _id: id, userId });
  }
}
