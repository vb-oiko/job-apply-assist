import { z } from "zod";
import { publicProcedure } from "..";
import { UserCredentials } from "../constants/types";
import { AuthService } from "../service/AuthService";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  login() {
    return publicProcedure
      .input(UserCredentials)
      .mutation(async ({ input }): Promise<LoginResponse> => {
        const { token } = await this.authService.signIn(input);
        return { access_token: token };
      });
  }

  signup() {
    return publicProcedure
      .input(UserCredentials)
      .mutation(async ({ input }): Promise<void> => {
        await this.authService.signUp(input);
      });
  }
}

export interface LoginResponse {
  access_token: string;
}
