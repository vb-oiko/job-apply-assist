import { createHTTPHandler } from "@trpc/server/adapters/standalone";
import http from "http";

import { AppRouter } from "..";
import { TrpcContext } from "../constants/types";

export const createServer = (appRouter: AppRouter) => {
  const handler = createHTTPHandler({
    router: appRouter,
    createContext(opts): TrpcContext {
      const authHeader = opts.req.headers.authorization;

      if (!authHeader) {
        return { isAuthenticated: false };
      }

      const [, token] = authHeader.split(" ");

      if (!token) {
        return { isAuthenticated: false };
      }

      return { isAuthenticated: true };
    },
  });

  return http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Request-Method", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
    res.setHeader("Access-Control-Allow-Headers", "*");
    if (req.method === "OPTIONS") {
      res.writeHead(200);
      return res.end();
    }
    handler(req, res);
  });
};
