import { Collection, MongoClient } from "mongodb";
import { nanoid } from "nanoid";
import { COLLECTIONS, DB_NAME } from "../constants/constants";
import { Position, RawPositionInsertObject } from "../constants/types";

export class PositionCollection {
  private collection: Collection<Position>;

  constructor(private readonly mongoClient: MongoClient) {
    this.collection = this.mongoClient
      .db(DB_NAME)
      .collection<Position>(COLLECTIONS.positions);
  }

  public async listAll(): Promise<Position[]> {
    return await this.collection.find({}).toArray();
  }

  public async insert(position: RawPositionInsertObject) {
    const result = await this.collection.insertOne({
      ...position,
      created: new Date(),
      _id: nanoid(),
    });

    return result.insertedId;
  }
}
