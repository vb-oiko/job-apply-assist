import { z } from "zod";
import { protectedProcedure } from "..";
import { PositionCollection } from "../collection/PositionCollection";
import {
  Position,
  PositionUpdateObject,
  RawPositionInsertObject,
} from "../constants/types";
import { PositionService } from "../service/PositionService";

export default class PositionController {
  constructor(
    private readonly positionCollection: PositionCollection,
    private readonly positionService: PositionService
  ) {}

  list() {
    return protectedProcedure
      .input(z.object({}))
      .query(async ({ ctx }): Promise<Position[]> => {
        return await this.positionCollection.listAll(ctx.userId!);
      });
  }

  create() {
    return protectedProcedure
      .input(RawPositionInsertObject)
      .mutation(async ({ input, ctx }): Promise<void> => {
        await this.positionService.createAndParse(input, ctx.userId!);
      });
  }

  delete() {
    return protectedProcedure
      .input(z.string())
      .mutation(async ({ input, ctx }): Promise<void> => {
        await this.positionCollection.delete(input, ctx.userId!);
      });
  }

  update() {
    return protectedProcedure
      .input(z.object({ id: z.string(), position: PositionUpdateObject }))
      .mutation(async ({ input, ctx }): Promise<void> => {
        await this.positionCollection.update(
          input.id,
          input.position,
          ctx.userId!
        );
      });
  }

  get() {
    return protectedProcedure
      .input(z.string())
      .query(async ({ ctx, input }): Promise<Position | null> => {
        return this.positionCollection.getById(input, ctx.userId!);
      });
  }

  parse() {
    return protectedProcedure
      .input(z.string())
      .mutation(async ({ input, ctx }): Promise<void> => {
        await this.positionService.parse(input, ctx.userId!);
      });
  }

  generateDocs() {
    return protectedProcedure
      .input(z.string())
      .mutation(async ({ input, ctx }): Promise<void> => {
        await this.positionService.generateDocs(input, ctx.userId!);
      });
  }

  generateAnswer() {
    return protectedProcedure
      .input(z.object({ positionId: z.string(), questionId: z.string() }))
      .mutation(async ({ input, ctx }): Promise<void> => {
        await this.positionService.generateAnswer(input, ctx.userId!);
      });
  }
}
