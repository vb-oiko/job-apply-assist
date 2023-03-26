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

export const updatePositionRequest = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("raw"),
    id: z.string(),
    url: z.string(),
    description: z.string(),
  }),
]);

export const deletePositionRequest = z.string();

export default class PositionController {
  constructor(
    private readonly trpcInstance: TRPCInstance,
    private readonly positionCollection: PositionCollection
  ) {}

  listPositions() {
    return this.trpcInstance.procedure
      .input(listPositionsRequest)
      .query(async ({ input }): Promise<Position[]> => {
        return await this.positionCollection.listAll();
      });
  }

  createPosition() {
    return this.trpcInstance.procedure
      .input(createPositionRequest)
      .mutation(async ({ input }): Promise<string> => {
        return await this.positionCollection.insert({
          ...input,
          type: "raw",
        });
      });
  }

  deletePosition() {
    return this.trpcInstance.procedure
      .input(deletePositionRequest)
      .mutation(async ({ input }): Promise<void> => {
        await this.positionCollection.delete(input);
      });
  }

  updatePosition() {
    return this.trpcInstance.procedure
      .input(updatePositionRequest)
      .mutation(async ({ input }): Promise<void> => {
        const { id, ...rest } = input;
        await this.positionCollection.update(input.id, rest);
      });
  }
}
