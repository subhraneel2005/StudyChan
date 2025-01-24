import {Router} from "express";
import { uploadRouter } from "./upload";
import { authRouter } from "./auth";

export const router = Router();

router.use("/studychan", uploadRouter);
router.use("/studychan", authRouter);