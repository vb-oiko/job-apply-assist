import { z } from "zod";
import { TRPCInstance } from "..";

export class AuthController {
  constructor(private readonly trpcInstance: TRPCInstance) {}

  login() {
    return this.trpcInstance.procedure
      .input(z.object({}))
      .mutation(async (): Promise<LoginResponse> => {
        return { access_token: "token" };
      });
  }
}

export interface LoginResponse {
  access_token: string;
}
