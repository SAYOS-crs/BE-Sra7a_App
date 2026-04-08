import { Router } from "express";
import {
  Google_social_provider,
  Login,
  refreshToken,
  SignUp,
} from "./Auth.service.js";
import validation from "../../Middlewares/validation.middleware.js";
import { LoginSchema, SignupSchema } from "./Auth.validation.js";
const router = Router();

router.post("/login", validation({ schema: LoginSchema }), Login);
router.post("/signup", validation({ schema: SignupSchema }), SignUp);
router.post("/Login-Google", Google_social_provider);
router.get("/refresh-token", refreshToken);
export default router;
