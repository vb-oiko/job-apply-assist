import { createHTTPHandler } from "@trpc/server/adapters/standalone";
import http from "http";
import jsonwebtoken from "jsonwebtoken";
const { verify } = jsonwebtoken;

import { AppRouter } from "..";
import { JwtConfig, JwtData, TrpcContext } from "../constants/types";
import { z } from "zod";

const JwtPayload = z.object({
  data: JwtData,
});

type JwtPayload = z.infer<typeof JwtPayload>;

export const createServer = (appRouter: AppRouter, jwtConfig: JwtConfig) => {
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

      try {
        const payload = verify(token, jwtConfig.secret, { complete: false });
        const jwtPayload = JwtPayload.safeParse(payload);

        if (jwtPayload.success) {
          return { isAuthenticated: true };
        }
      } catch (error) {}

      return { isAuthenticated: false };
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
