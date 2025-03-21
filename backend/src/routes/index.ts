import {Router} from "express";
import { uploadRouter } from "./upload";
import { authRouter } from "./auth";
import { userQueryRouter } from "./chat";

export const router = Router();

router.use("/studychan", uploadRouter);
router.use("/studychan", authRouter);
router.use("/studychan", userQueryRouter);