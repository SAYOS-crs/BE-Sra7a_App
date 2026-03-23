import crypto from "node:crypto";
import { SERCRET_KEY } from "../../../config/config.service.js";
const IV_Length = 16;
export const Encrypt = async (data) => {
  const iv = crypto.randomBytes(IV_Length);
  const cipher = crypto.createCipheriv("aes-256-cbc", SERCRET_KEY, iv);
  let result = cipher.update(data, "utf-8", "hex");
  result += cipher.final("hex");
  return `${iv.toString("hex")}:${result}`;
};
export const Decrypt = async (data) => {
  const [iv, text] = data.split(":");

  const BinaryIV = Buffer.from(iv, "hex");

  const decrypt = crypto.createDecipheriv("aes-256-cbc", SERCRET_KEY, BinaryIV);
  let DecryptedData = decrypt.update(text, "hex", "utf-8");
  DecryptedData += decrypt.final("utf-8");
  console.log(DecryptedData);
  return DecryptedData;
};
