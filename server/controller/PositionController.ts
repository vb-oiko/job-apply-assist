import { nanoid } from "nanoid";
import { z } from "zod";
import { TRPCInstance } from "..";
import { Position } from "../constants/types";

const positions: Position[] = [];

export const listPositionsRequest = z.object({
  offset: z.number().optional(),
  limit: z.number().optional(),
});

export const createPositionRequest = z.object({
  url: z.string(),
  description: z.string(),
});

export default class PositionController {
  constructor(private readonly trpcInstance: TRPCInstance) {}

  listPositions() {
    return this.trpcInstance.procedure
      .input(listPositionsRequest)
      .query(async ({ input }): Promise<ListPositionsResponse> => {
        return { positions };
      });
  }

  createPosition() {
    return this.trpcInstance.procedure
      .input(createPositionRequest)
      .mutation(async ({ input }): Promise<CreatePositionResponse> => {
        const id = nanoid();
        positions.push({ ...input, id, type: "raw" });
        return { id: "id" };
      });
  }
}

export type CreatePositionResponse = {
  id: string;
};

export type ListPositionsResponse = {
  positions: Position[];
};
