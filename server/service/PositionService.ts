import { PositionCollection } from "../collection/PositionCollection";
import { AiService } from "./AiService";

export class PositionService {
  constructor(
    private readonly positionCollection: PositionCollection,
    private readonly aiService: AiService
  ) {}

  public async parse(positionId: string) {
    const position = await this.positionCollection.getById(positionId);

    if (!position) {
      throw new Error("Position not found");
    }

    const { title, company, reasons } =
      await this.aiService.mockExtractPositionAndCompany(position.description);

    const { _id: id, url, description } = position;

    await this.positionCollection.update(id, {
      type: "parsed",
      url,
      description,
      title,
      company,
      reasons,
    });
  }
}
