import { initTRPC } from "@trpc/server";
import * as dotenv from "dotenv";
import { createServer } from "./utils/createServer";
import { SERVER_PORT } from "./constants/constants";
import PositionController from "./controller/PositionController";

dotenv.config();

const trpcInstance = initTRPC.create();
const positionController = new PositionController(trpcInstance);

const router = trpcInstance.router;
const appRouter = router({
  listPositions: positionController.listPositions(),
  createPosition: positionController.createPosition(),
});

const server = createServer(appRouter);

server.listen(SERVER_PORT);

export type AppRouter = typeof appRouter;
export type TRPCInstance = typeof trpcInstance;
