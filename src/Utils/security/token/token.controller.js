import { GetSignature } from "./signature.service.js";
import { GeneratToken } from "./token.service.js";
import { v4 as uuidv4 } from "uuid";
export const GeneratCredentials = async (user) => {
  const signature = await GetSignature(user.Roll);
  //   -----------------------
  const RefreshToken = GeneratToken({
    payloud: user.id,
    signature: signature.RefreshSignature,
    options: {
      expiresIn: "7 days",
      jwtid: uuidv4(),
    },
  });
  // ---------------------------
  const AccessToken = GeneratToken({
    payloud: user.id,
    signature: signature.AccessSignature,
    options: {
      expiresIn: "2h",
      jwtid: uuidv4(),
    },
  });
  //   -----------------------
  return { RefreshToken, AccessToken };
};
