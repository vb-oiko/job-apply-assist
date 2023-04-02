import { PositionCollection } from "../collection/PositionCollection";
import { RawPositionInsertObject } from "../constants/types";
import { AiService } from "./AiService";
import { GDocService } from "./GDocService";
import { PromptService } from "./PromptService";

export class PositionService {
  constructor(
    private readonly positionCollection: PositionCollection,
    private readonly aiService: AiService,
    private readonly gDocService: GDocService,
    private readonly promptService: PromptService
  ) {}

  public async parse(positionId: string) {
    const position = await this.getPositionOrFail(positionId);

    const { _id: id, url, description } = position;

    const { title, company, reasons, city } =
      await this.aiService.extractJobInfo(description);

    const matchingPoints = await this.aiService.getMatchingPoints(description);
    const objective = await this.aiService.getObjective(description);

    const name = await this.promptService.getName();

    await this.positionCollection.update(id, {
      type: "parsed",
      url,
      description,
      title,
      company,
      reasons,
      matchingPoints,
      city,
      name,
      objective,
    });
  }

  public async generateDocs(positionId: string) {
    const position = await this.getPositionOrFail(positionId);

    if (position.type === "raw") {
      throw new Error("Position not parsed");
    }

    const { title, company, name, city, reasons, matchingPoints, objective } =
      position;

    const coverLetterText = await this.aiService.getCoverLetterText({
      title,
      company,
      reasons,
      matchingPoints,
    });

    const { resumeUrl, coverLetterUrl } =
      await this.gDocService.createDocuments({
        title,
        company,
        name,
        city,
        coverLetterText,
        objective,
      });

    await this.positionCollection.update(positionId, {
      type: "generated",
      resumeUrl,
      coverLetterUrl,
    });
  }

  private async getPositionOrFail(positionId: string) {
    const position = await this.positionCollection.getById(positionId);

    if (!position) {
      throw new Error("Position not found");
    }

    return position;
  }

  public async createAndParse(position: RawPositionInsertObject) {
    const positionId = await this.positionCollection.insert({
      ...position,
    });

    await this.parse(positionId);
  }

  public async generateAnswer({
    positionId,
    questionId,
  }: {
    positionId: string;
    questionId: string;
  }) {
    const position = await this.getPositionOrFail(positionId);

    const { questions, description } = position;

    const question = questions?.find((question) => question.id === questionId);

    if (!question) {
      throw new Error("Question not found");
    }

    const answer = await this.aiService.getAnswerText({
      question: question.question,
      description,
      resume: await this.promptService.getResume(),
    });

    await this.positionCollection.update(positionId, {
      ...position,
      questions: questions?.map((question) =>
        question.id === questionId ? { ...question, answer } : question
      ),
    });
  }
}
