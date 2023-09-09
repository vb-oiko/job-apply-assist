import * as trpc from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
import cors from "cors";

import { AppRouter } from "..";

export type Context = trpc.inferAsyncReturnType<typeof createContext>;

// created for each request
const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({ req, res });

export const createServer = (appRouter: AppRouter) => {
  const app = express();
  app.use(cors());

  app.use(
    "/",
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  return app;
};
