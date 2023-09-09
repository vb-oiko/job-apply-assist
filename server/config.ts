import * as dotenv from "dotenv";
import { Config } from "./constants/types";

dotenv.config();

export const config: Config = {
  google: {
    email: process.env.GOOGLE_CLIENT_EMAIL!,
    key: process.env.GOOGLE_PRIVATE_KEY!,
    rootFolderId: process.env.GOOGLE_ROOT_FOLDER_ID!,
    coverLetterTemplateId: process.env.GOOGLE_COVER_LETTER_TEMPLATE_ID!,
    resumeTemplateId: process.env.GOOGLE_RESUME_TEMPLATE_ID!,
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY!,
  },
  mongoDb: {
    connectUri: process.env.MONGO_DB_CONNECT_URI!,
  },
  jwt: {
    secret: process.env.JWT_SECRET!,
  },
};
