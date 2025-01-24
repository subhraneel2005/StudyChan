import { Router } from "express";
import { signup } from "../services/auth/signup";
import { signin } from "../services/auth/signin";

export const authRouter = Router();

authRouter.post("/signup",signup);

authRouter.post("/signin", signin);
