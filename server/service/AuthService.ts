import * as argon2 from "argon2";
import jsonwebtoken from "jsonwebtoken";
const { sign } = jsonwebtoken;

import { TRPCError } from "@trpc/server";
import { UserCollection } from "../collection/UserCollection";
import { JwtConfig, JwtData, User, UserCredentials } from "../constants/types";

const JWT_EXPIRES_IN = "30m";

export class AuthService {
  constructor(
    private readonly jwtConfig: JwtConfig,
    private readonly userCollection: UserCollection
  ) {}

  public async signUp({ login, password }: UserCredentials) {
    const user = await this.userCollection.getByLogin(login);

    if (user) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        cause: "User already exists",
      });
    }

    const hash = await argon2.hash(password);

    this.userCollection.insert({ login, hash });
  }

  public async signIn({ login, password }: UserCredentials) {
    const user = await this.userCollection.getByLogin(login);

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        cause: "Either login or password is incorrect",
      });
    }

    const isPasswordCorrect = argon2.verify(user.hash, password);

    if (!isPasswordCorrect) {
      throw new TRPCError({
        code: "NOT_FOUND",
        cause: "Either login or password is incorrect",
      });
    }

    const token = this.generateToken(user);
    return { token };
  }

  private generateToken(user: User) {
    const data: JwtData = {
      userId: user._id,
    };

    return sign({ data }, this.jwtConfig.secret, {
      expiresIn: JWT_EXPIRES_IN,
    });
  }
}
