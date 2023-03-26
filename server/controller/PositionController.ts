import { z } from "zod";
import { TRPCInstance } from "..";
import { PositionCollection } from "../collection/PositionCollection";
import {
  Position,
  PositionUpdateObject,
  RawPositionInsertObject,
} from "../constants/types";

export default class PositionController {
  constructor(
    private readonly trpcInstance: TRPCInstance,
    private readonly positionCollection: PositionCollection
  ) {}

  listPositions() {
    return this.trpcInstance.procedure
      .input(z.object({}))
      .query(async (): Promise<Position[]> => {
        return await this.positionCollection.listAll();
      });
  }

  createPosition() {
    return this.trpcInstance.procedure
      .input(RawPositionInsertObject)
      .mutation(async ({ input }): Promise<string> => {
        return await this.positionCollection.insert(input);
      });
  }

  deletePosition() {
    return this.trpcInstance.procedure
      .input(z.string())
      .mutation(async ({ input }): Promise<void> => {
        await this.positionCollection.delete(input);
      });
  }

  updatePosition() {
    return this.trpcInstance.procedure
      .input(PositionUpdateObject)
      .mutation(async ({ input }): Promise<void> => {
        await this.positionCollection.update(input);
      });
  }
}
