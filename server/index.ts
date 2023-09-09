import { TRPCError, initTRPC } from "@trpc/server";
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
import { AuthController } from "./controller/AuthController";

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

export interface TrpcContext {
  isAuthenticated: boolean;
}

const t = initTRPC.context<TrpcContext>().create();

export const middleware = t.middleware;
export const publicProcedure = t.procedure;
const router = t.router;

const isAuthenticated = middleware((opts) => {
  console.warn(opts);

  if (!opts.ctx.isAuthenticated) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return opts.next();
});

export const protectedProcedure = publicProcedure.use(isAuthenticated);

const positionController = new PositionController(
  positionCollection,
  positionService
);

const authController = new AuthController();

const appRouter = router({
  listPositions: positionController.list(),
  createPosition: positionController.create(),
  deletePosition: positionController.delete(),
  updatePosition: positionController.update(),
  getPosition: positionController.get(),
  parsePosition: positionController.parse(),
  generateDocs: positionController.generateDocs(),
  generateAnswer: positionController.generateAnswer(),
  login: authController.login(),
});

const server = createServer(appRouter);

server.listen(SERVER_PORT);

export type AppRouter = typeof appRouter;
export type TRPCInstance = typeof t;
