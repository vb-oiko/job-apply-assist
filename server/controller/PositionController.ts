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
      .query(async (): Promise<Position[]> => {
        return await this.positionCollection.listAll();
      });
  }

  create() {
    return protectedProcedure
      .input(RawPositionInsertObject)
      .mutation(async ({ input }): Promise<void> => {
        await this.positionService.createAndParse(input);
      });
  }

  delete() {
    return protectedProcedure
      .input(z.string())
      .mutation(async ({ input }): Promise<void> => {
        await this.positionCollection.delete(input);
      });
  }

  update() {
    return protectedProcedure
      .input(z.object({ id: z.string(), position: PositionUpdateObject }))
      .mutation(async ({ input }): Promise<void> => {
        await this.positionCollection.update(input.id, input.position);
      });
  }

  get() {
    return protectedProcedure
      .input(z.string())
      .query(async ({ ctx, input }): Promise<Position | null> => {
        return this.positionCollection.getById(input);
      });
  }

  parse() {
    return protectedProcedure
      .input(z.string())
      .mutation(async ({ input }): Promise<void> => {
        await this.positionService.parse(input);
      });
  }

  generateDocs() {
    return protectedProcedure
      .input(z.string())
      .mutation(async ({ input }): Promise<void> => {
        await this.positionService.generateDocs(input);
      });
  }

  generateAnswer() {
    return protectedProcedure
      .input(z.object({ positionId: z.string(), questionId: z.string() }))
      .mutation(async ({ input }): Promise<void> => {
        await this.positionService.generateAnswer(input);
      });
  }
}
