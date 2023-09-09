import { Collection, MongoClient } from "mongodb";
import { nanoid } from "nanoid";
import { COLLECTIONS, DB_NAME } from "../constants/constants";
import { User } from "../constants/types";

export class UserCollection {
  private collection: Collection<User>;

  constructor(private readonly mongoClient: MongoClient) {
    this.collection = this.mongoClient
      .db(DB_NAME)
      .collection<User>(COLLECTIONS.users);
  }

  public async listAll(): Promise<User[]> {
    return await this.collection.find({}).toArray();
  }

  public async insert(user: Omit<User, "_id" | "created">) {
    const result = await this.collection.insertOne({
      ...user,
      created: new Date(),
      _id: nanoid(),
    });

    return result.insertedId;
  }

  public async getById(id: string): Promise<User | null> {
    return this.collection.findOne({ _id: id });
  }

  public async getByLogin(login: string): Promise<User | null> {
    return this.collection.findOne({ login });
  }

  public async update(id: string, user: Omit<User, "_id">) {
    await this.collection.updateOne({ _id: id }, { $set: user });
  }
}
