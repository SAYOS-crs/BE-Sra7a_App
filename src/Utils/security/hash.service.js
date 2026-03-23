import { hash, compare } from "bcrypt";
import { Salt } from "../../../config/config.service.js";

export const Hash = async (data) => {
  const result = await hash(data, Salt);
  return result;
};
export const Compare = async ({ data, cipher }) => {
  const result = await compare(data, cipher);
  return result;
};
