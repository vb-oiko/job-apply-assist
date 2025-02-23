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
import { PromptCollection } from "./collection/PromptCollection";
import { createServer } from "./utils/createServer";
import { AuthController } from "./controller/AuthController";
import { TrpcContext } from "./constants/types";
import { AuthService } from "./service/AuthService";
import { UserCollection } from "./collection/UserCollection";
import { exit } from "process";

const mongoClient = new MongoClient(config.mongoDb.connectUri, {
  serverApi: ServerApiVersion.v1,
});
mongoClient
  .connect()
  .then(() => {
    console.log("Successfully connected to DB");
  })
  .catch((err) => {
    console.log("Failed to connect to DB: ", err);
    exit(1);
  });

const positionCollection = new PositionCollection(mongoClient);
const userCollection = new UserCollection(mongoClient);
const promptCollection = new PromptCollection(mongoClient);

const promptService = new PromptService(promptCollection);
const aiService = new AiService(config.openai, promptService);
const gDocService = new GDocService(config.google);
const positionService = new PositionService(
  positionCollection,
  aiService,
  gDocService,
  promptService
);
const authService = new AuthService(config.jwt, userCollection);

const t = initTRPC.context<TrpcContext>().create();

export const middleware = t.middleware;
export const publicProcedure = t.procedure;
const router = t.router;

const isAuthenticated = middleware((opts) => {
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

const authController = new AuthController(authService);

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
  signup: authController.signup(),
});

const server = createServer(appRouter, config.jwt);

server.listen(SERVER_PORT);

export type AppRouter = typeof appRouter;
export type TRPCInstance = typeof t;
