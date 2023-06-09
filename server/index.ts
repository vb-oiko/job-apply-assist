import { initTRPC } from "@trpc/server";
import * as dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";
import { Configuration, OpenAIApi } from "openai";
import { PositionCollection } from "./collection/PositionCollection";
import { SERVER_PORT } from "./constants/constants";
import PositionController from "./controller/PositionController";
import { AiService } from "./service/AiService";
import { GDocService } from "./service/GDocService";
import { PositionService } from "./service/PositionService";
import { PromptService } from "./service/PromptService";
import { createServer } from "./utils/createServer";

dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_DB_CONNECT_URI!, {
  serverApi: ServerApiVersion.v1,
});
mongoClient.connect();
const positionCollection = new PositionCollection(mongoClient);

const openAiConfiguration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const promptService = new PromptService();

const openai = new OpenAIApi(openAiConfiguration);
const aiService = new AiService(openai, promptService);
const gDocService = new GDocService({
  email: process.env.GOOGLE_CLIENT_EMAIL!,
  key: process.env.GOOGLE_PRIVATE_KEY!,
  rootFolderId: process.env.GOOGLE_ROOT_FOLDER_ID!,
  coverLetterTemplateId: process.env.GOOGLE_COVER_LETTER_TEMPLATE_ID!,
  resumeTemplateId: process.env.GOOGLE_RESUME_TEMPLATE_ID!,
});

const positionService = new PositionService(
  positionCollection,
  aiService,
  gDocService,
  promptService
);

const trpcInstance = initTRPC.create();
const positionController = new PositionController(
  trpcInstance,
  positionCollection,
  positionService
);

const router = trpcInstance.router;
const appRouter = router({
  listPositions: positionController.list(),
  createPosition: positionController.create(),
  deletePosition: positionController.delete(),
  updatePosition: positionController.update(),
  getPosition: positionController.get(),
  parsePosition: positionController.parse(),
  generateDocs: positionController.generateDocs(),
  generateAnswer: positionController.generateAnswer(),
});

const server = createServer(appRouter);

server.listen(SERVER_PORT);

export type AppRouter = typeof appRouter;
export type TRPCInstance = typeof trpcInstance;
