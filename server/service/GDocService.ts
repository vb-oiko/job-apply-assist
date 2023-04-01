import { docs_v1, drive_v3, google } from "googleapis";
import Auth from "google-auth-library";

export interface GDocServiceConfig {
  email: string;
  key: string;
  rootFolderId: string;
  coverLetterTemplateId: string;
  resumeTemplateId: string;
}

export class GDocService {
  private auth: Auth.JWT;
  private drive: drive_v3.Drive;
  private docs: docs_v1.Docs;

  constructor(private readonly config: GDocServiceConfig) {
    this.auth = new google.auth.JWT({
      email: this.config.email,
      key: this.config.key,
      scopes: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/documents",
      ],
    });

    this.drive = google.drive({ version: "v3", auth: this.auth });
    this.docs = google.docs({ version: "v1", auth: this.auth });
  }

  private createCompanySubFolder = async (company: string) => {
    const folder = await this.drive.files.create({
      requestBody: {
        name: company,
        mimeType: "application/vnd.google-apps.folder",
        parents: [this.config.rootFolderId],
      },
    });

    if (!folder.data.id) {
      throw new Error("Failed to create a new subfolder with the company name");
    }

    return folder.data.id;
  };

  private copyTemplate = async ({
    name,
    folderId,
    templateId,
  }: {
    name: string;
    folderId: string;
    templateId: string;
  }) => {
    const newDoc = await this.drive.files.copy({
      fileId: templateId,
      requestBody: {
        name,
        parents: [folderId],
      },
    });

    if (!newDoc.data.id) {
      throw new Error("Failed to copy the template");
    }

    return newDoc.data.id;
  };

  private replacePlaceholders = async (
    templateId: string,
    params: Record<string, string>
  ) => {
    const requests = Object.entries(params).map(([key, value]) => ({
      replaceAllText: {
        containsText: {
          text: `{${key}}`,
          matchCase: true,
        },
        replaceText: value,
      },
    }));

    await this.docs.documents.batchUpdate({
      documentId: templateId,
      requestBody: {
        requests,
      },
    });
  };

  private getCurrentDate = () => {
    const date = new Date();
    const month = date.toLocaleString("default", { month: "long" });
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  private createResume = async (folderId: string, params: ResumeParams) => {
    const resumeId = await this.copyTemplate({
      name: `${params.title} - Resume - ${params.name}`,
      folderId,
      templateId: this.config.resumeTemplateId,
    });

    await this.replacePlaceholders(resumeId, params);

    return resumeId;
  };

  private createCoverLetter = async (
    folderId: string,
    params: CoverLetterParams
  ) => {
    const coverLetterId = await this.copyTemplate({
      name: `${params.title} - Cover Letter - ${params.name}`,
      folderId,
      templateId: this.config.coverLetterTemplateId,
    });

    await this.replacePlaceholders(coverLetterId, {
      ...params,
      date: this.getCurrentDate(),
    });

    return coverLetterId;
  };

  private getDocumentUrl = async (documentId: string) => {
    const document = await this.drive.files.get({
      fileId: documentId,
      fields: "webViewLink",
    });

    const { webViewLink } = document.data;

    if (!webViewLink) {
      throw new Error("Failed to get the document URL");
    }

    return webViewLink;
  };

  public createDocuments = async (params: CreateDocumentsParams) => {
    console.log("Creating documents started");

    const { company, name, title, city, coverLetterText } = params;

    const folderId = await this.createCompanySubFolder(company);

    const resumeId = await this.createResume(folderId, { name, title, city });
    const coverLetterId = await this.createCoverLetter(folderId, {
      name,
      coverLetterText,
      title,
      city,
    });

    const resumeUrl = await this.getDocumentUrl(resumeId);
    const coverLetterUrl = await this.getDocumentUrl(coverLetterId);

    console.log("Creating documents finished");
    return { resumeUrl, coverLetterUrl };
  };
}

export interface ResumeParams extends Record<string, string> {
  name: string;
  title: string;
  city: string;
}

export interface CoverLetterParams extends Record<string, string> {
  name: string;
  coverLetterText: string;
  title: string;
  city: string;
}

export interface CreateDocumentsParams extends ResumeParams, CoverLetterParams {
  company: string;
}
