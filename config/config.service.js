import dotenv from "dotenv";
import { resolve } from "node:path";
dotenv.config({ path: resolve("./config/.env.dev") });

export const PORT = parseInt(process.env.PORT);
export const DataBase_URI = process.env.DATA_BASE;
