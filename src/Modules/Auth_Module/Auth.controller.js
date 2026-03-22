import { Router } from "express";
import Login from "./Auth.service.js";
const router = Router();

router.get("/login", Login);

export default router;
