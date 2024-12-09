import { config } from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";

const USER_ID = "";

async function upgrade() {
  config();

  const mongoClient = new MongoClient(process.env.MONGO_DB_CONNECT_URI, {
    serverApi: ServerApiVersion.v1,
  });

  mongoClient.connect();

  const collection = mongoClient.db("job_apply_assist").collection("positions");

  const documents = await collection.find({}).toArray();

  for (const document of documents) {
    await collection.updateOne(
      { _id: document._id },
      { $set: { userId: USER_ID } }
    );
  }

  console.warn("Done!");
}

upgrade();
