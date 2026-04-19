import { Router } from "express";
import {
  ConfirmEmail,
  ForgetPassword,
  Google_social_provider,
  Login,
  Logout,
  Logout_Redis,
  refreshToken,
  ResendOTP,
  ResetPassword,
  SignUp,
  UpdatePassword,
} from "./Auth.service.js";
import validation from "../../Middlewares/validation.middleware.js";
import {
  ForgetPasswordSchema,
  LoginSchema,
  LogoutSchema,
  ResetPasswordSchema,
  SignupSchema,
  UpdatePasswordSchema,
} from "./Auth.validation.js";
import { Authentication } from "../../Middlewares/authentication.middleware.js";
import { SignatureType } from "../../Utils/enums/Token.Enum.js";
import { Authorization } from "../../Middlewares/authorization.middleware.js";
import { RollEnum } from "../../Utils/enums/Enums.js";
const router = Router();

router.post("/signup", validation({ schema: SignupSchema }), SignUp);
router.post("/login", validation({ schema: LoginSchema }), Login);
router.post("/Login-Google", Google_social_provider);
// logout end points
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
// confirm email
router.patch("/Confirm-Email", ConfirmEmail);
router.get("/Resend-OTP", ResendOTP);
// password
router.post(
  "/forget-password",
  validation({ schema: ForgetPasswordSchema }),
  ForgetPassword,
);
router.patch(
  "/Reset-password",
  validation({ schema: ResetPasswordSchema }),
  ResetPassword,
);
router.patch(
  "/Update-password",
  validation({ schema: UpdatePasswordSchema }),
  Authentication({ TokenType: SignatureType.AccessToken }),
  Authorization({ AuthorizedRolles: [RollEnum.User, RollEnum.Admin] }),
  UpdatePassword,
);
// refrush token
router.get("/refresh-token", refreshToken);
export default router;
