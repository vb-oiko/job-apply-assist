import { z } from "zod";
import { TRPCInstance } from "..";
import { PositionCollection } from "../collection/PositionCollection";
import { Position } from "../constants/types";

export const listPositionsRequest = z.object({
  offset: z.number().optional(),
  limit: z.number().optional(),
});

export const createPositionRequest = z.object({
  url: z.string(),
  description: z.string(),
});

export default class PositionController {
  constructor(
    private readonly trpcInstance: TRPCInstance,
    private readonly positionCollection: PositionCollection
  ) {}

  listPositions() {
    return this.trpcInstance.procedure
      .input(listPositionsRequest)
      .query(async ({ input }): Promise<ListPositionsResponse> => {
        return { positions: await this.positionCollection.listAll() };
      });
  }

  createPosition() {
    return this.trpcInstance.procedure
      .input(createPositionRequest)
      .mutation(async ({ input }): Promise<CreatePositionResponse> => {
        const id = await this.positionCollection.insert({
          ...input,
          type: "raw",
        });
        return { id };
      });
  }
}

export type CreatePositionResponse = {
  id: string;
};

export type ListPositionsResponse = {
  positions: Position[];
};
