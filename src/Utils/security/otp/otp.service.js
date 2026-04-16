import { customAlphabet } from "nanoid";

export const GenerateOTP = () => {
  const result = customAlphabet("1234567890abcdef", 6);

  return result();
};
