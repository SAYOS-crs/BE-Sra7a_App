import { Router } from "express";
import {
  GetSinglerMessage,
  GetMessages,
  SendMessage,
  SendMessage_Authed,
} from "./message.service.js";
import { Authentication } from "../../Middlewares/authentication.middleware.js";
import { SignatureType } from "../../Utils/enums/Token.Enum.js";
import { Authorization } from "../../Middlewares/authorization.middleware.js";
import { RollEnum } from "../../Utils/enums/Enums.js";
const router = Router();
// ----------------- send message --------------------
// no auth requied
router.post("/Send-message/:UserId", SendMessage);
// auth required
router.post(
  "/Send-message-authed/:UserId",
  Authentication({ TokenType: SignatureType.AccessToken }),
  Authorization({ AuthorizedRolles: [RollEnum.User, RollEnum.Admin] }),
  SendMessage_Authed,
);
// ----------------- get user message ----------------
router.get(
  "/GetUserMessage{/:UserId}",
  Authentication({ TokenType: SignatureType.AccessToken }),
  Authorization({ AuthorizedRolles: [RollEnum.Admin, RollEnum.User] }),
  GetMessages,
);
// get all messagees by admin
router.get(
  "/GetSingleUserMessage/:messageID",
  Authentication({ TokenType: SignatureType.AccessToken }),
  Authorization({ AuthorizedRolles: [RollEnum.Admin] }),
  GetSinglerMessage,
);
export default router;
