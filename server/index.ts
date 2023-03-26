import { initTRPC } from "@trpc/server";
import * as dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";
import { Configuration, OpenAIApi } from "openai";
import { PositionCollection } from "./collection/PositionCollection";
import { PromptCollection } from "./collection/PromptCollection";
import { SERVER_PORT } from "./constants/constants";
import PositionController from "./controller/PositionController";
import PromptController from "./controller/PromptController";
import { AiService } from "./service/AiService";
import { PositionService } from "./service/PositionService";
import { createServer } from "./utils/createServer";

dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_DB_CONNECT_URI!, {
  serverApi: ServerApiVersion.v1,
});
mongoClient.connect();
const positionCollection = new PositionCollection(mongoClient);
const promptCollection = new PromptCollection(mongoClient);

const openAiConfiguration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(openAiConfiguration);
const aiService = new AiService(promptCollection, openai);

const positionService = new PositionService(positionCollection, aiService);

const trpcInstance = initTRPC.create();
const positionController = new PositionController(
  trpcInstance,
  positionCollection,
  positionService
);

const promptController = new PromptController(trpcInstance, promptCollection);

const router = trpcInstance.router;
const appRouter = router({
  listPositions: positionController.list(),
  createPosition: positionController.create(),
  deletePosition: positionController.delete(),
  updatePosition: positionController.update(),
  getPosition: positionController.get(),
  parsePosition: positionController.parse(),

  listPrompts: promptController.listPrompts(),
  createPrompt: promptController.createPrompt(),
  getPromptTypes: promptController.getPromptTypes(),
});

const server = createServer(appRouter);

server.listen(SERVER_PORT);

export type AppRouter = typeof appRouter;
export type TRPCInstance = typeof trpcInstance;
