import { initTRPC } from "@trpc/server";
import * as dotenv from "dotenv";
import { createServer } from "./utils/createServer";
import { SERVER_PORT } from "./constants/constants";
import PositionController from "./controller/PositionController";
import { MongoClient, ServerApiVersion } from "mongodb";
import { PositionCollection } from "./collection/PositionCollection";
import PromptController from "./controller/PromptController";
import { PromptCollection } from "./collection/PromptCollection";

dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_DB_CONNECT_URI!, {
  serverApi: ServerApiVersion.v1,
});
mongoClient.connect();
const positionCollection = new PositionCollection(mongoClient);
const promptCollection = new PromptCollection(mongoClient);

const trpcInstance = initTRPC.create();

const positionController = new PositionController(
  trpcInstance,
  positionCollection
);

const promptController = new PromptController(trpcInstance, promptCollection);

const router = trpcInstance.router;
const appRouter = router({
  listPositions: positionController.listPositions(),
  createPosition: positionController.createPosition(),
  deletePosition: positionController.deletePosition(),
  listPrompts: promptController.listPrompts(),
  createPrompt: promptController.createPrompt(),
  getPromptTypes: promptController.getPromptTypes(),
});

const server = createServer(appRouter);

server.listen(SERVER_PORT);

export type AppRouter = typeof appRouter;
export type TRPCInstance = typeof trpcInstance;
