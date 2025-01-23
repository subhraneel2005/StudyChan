import {Router} from "express";
import { uploadRouter } from "./upload";

export const router = Router();

router.use("/studychan", uploadRouter)