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

  list() {
    return this.trpcInstance.procedure
      .input(z.object({}))
      .query(async (): Promise<Position[]> => {
        return await this.positionCollection.listAll();
      });
  }

  create() {
    return this.trpcInstance.procedure
      .input(RawPositionInsertObject)
      .mutation(async ({ input }): Promise<string> => {
        return await this.positionCollection.insert(input);
      });
  }

  delete() {
    return this.trpcInstance.procedure
      .input(z.string())
      .mutation(async ({ input }): Promise<void> => {
        await this.positionCollection.delete(input);
      });
  }

  update() {
    return this.trpcInstance.procedure
      .input(z.object({ id: z.string(), position: PositionUpdateObject }))
      .mutation(async ({ input }): Promise<void> => {
        await this.positionCollection.update(input.id, input.position);
      });
  }

  get() {
    return this.trpcInstance.procedure
      .input(z.string())
      .query(async ({ input }): Promise<Position | null> => {
        return this.positionCollection.getById(input);
      });
  }
}
