import { config } from "./config";
import { TRPCError, initTRPC } from "@trpc/server";
import { MongoClient, ServerApiVersion } from "mongodb";
import { PositionCollection } from "./collection/PositionCollection";
import { SERVER_PORT } from "./constants/constants";
import PositionController from "./controller/PositionController";
import { AiService } from "./service/AiService";
import { GDocService } from "./service/GDocService";
import { PositionService } from "./service/PositionService";
import { PromptService } from "./service/PromptService";
import { createServer } from "./utils/createServer";
import { AuthController } from "./controller/AuthController";
import { TrpcContext } from "./constants/types";

const mongoClient = new MongoClient(config.mongoDb.connectUri, {
  serverApi: ServerApiVersion.v1,
});
mongoClient.connect();

const positionCollection = new PositionCollection(mongoClient);

const promptService = new PromptService();
const aiService = new AiService(config.openai, promptService);
const gDocService = new GDocService(config.google);
const positionService = new PositionService(
  positionCollection,
  aiService,
  gDocService,
  promptService
);

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
