import { PositionCollection } from "../collection/PositionCollection";
import { AiService } from "./AiService";

export class PositionService {
  constructor(
    private readonly positionCollection: PositionCollection,
    private readonly aiService: AiService
  ) {}

  public async parse(positionId: string) {
    const position = await this.getPositionOrFail(positionId);

    const { _id: id, url, description } = position;

    const { title, company, reasons } = await this.aiService.extractJobInfo(
      description
    );

    const matchingPoints = await this.aiService.getMatchingPoints(description);

    await this.positionCollection.update(id, {
      type: "parsed",
      url,
      description,
      title,
      company,
      reasons,
      matchingPoints,
    });
  }

  public async generateDocs(positionId: string) {
    const position = await this.getPositionOrFail(positionId);

    if (position.type !== "parsed") {
      throw new Error("Position not parsed");
    }

    const { title, company, reasons, matchingPoints } = position;

    const coverLetter = await this.aiService.getCoverLetter({
      title,
      company,
      reasons,
      matchingPoints,
    });

    console.warn(coverLetter);
  }

  private async getPositionOrFail(positionId: string) {
    const position = await this.positionCollection.getById(positionId);

    if (!position) {
      throw new Error("Position not found");
    }

    return position;
  }
}
