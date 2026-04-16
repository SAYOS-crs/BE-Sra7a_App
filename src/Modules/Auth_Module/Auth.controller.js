import { Router } from "express";
import {
  ConfirmEmail,
  Google_social_provider,
  Login,
  Logout,
  Logout_Redis,
  refreshToken,
  ResendOTP,
  SignUp,
} from "./Auth.service.js";
import validation from "../../Middlewares/validation.middleware.js";
import { LoginSchema, LogoutSchema, SignupSchema } from "./Auth.validation.js";
import { Authentication } from "../../Middlewares/authentication.middleware.js";
import { SignatureType } from "../../Utils/enums/Token.Enum.js";
const router = Router();

router.post("/login", validation({ schema: LoginSchema }), Login);
router.post("/signup", validation({ schema: SignupSchema }), SignUp);
router.post(
  "/Logout",
  Authentication({ TokenType: SignatureType.AccessToken }),
  validation({ schema: LogoutSchema }),
  Logout,
);
router.post(
  "/Logout-Redis",
  Authentication({ TokenType: SignatureType.AccessToken }),
  validation({ schema: LogoutSchema }),
  Logout_Redis,
);
router.post("/Login-Google", Google_social_provider);
router.patch("/Confirm-Email", ConfirmEmail);
router.get("/refresh-token", refreshToken);
router.get("/Resend-OTP", ResendOTP);
export default router;
