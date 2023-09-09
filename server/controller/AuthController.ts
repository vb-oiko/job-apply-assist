import { z } from "zod";
import { TRPCInstance, publicProcedure } from "..";

export class AuthController {
  login() {
    return publicProcedure
      .input(z.object({}))
      .mutation(async (): Promise<LoginResponse> => {
        return { access_token: "token" };
      });
  }
}

export interface LoginResponse {
  access_token: string;
}
