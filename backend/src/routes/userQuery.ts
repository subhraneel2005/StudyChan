import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { UserQuerySchema } from "../zod-types/UserQuery";
import { semanticSearch } from "../services/ai/semanticSearch";
import { generateAIResponse } from "../services/ai/aiResponse";

export const userQueryRouter = Router();

const userQueryHandler = async (req: any, res: any) => {
  try {
    const userId = req.userId;
    const { userQuery, documentId } = UserQuerySchema.parse(req.body);

    const relevantChunks = await semanticSearch(userQuery, documentId);
    const aiResponse = await generateAIResponse(userQuery, relevantChunks!);

    return res.status(201).json({
      message: "User Query embedding is working successfully :)",
      aiResponse
      
    });
  } catch (error) {
    return res.status(500).json({
        message: "Internal server error",
        error: error
    })
  }
};

userQueryRouter.post("/ask", authMiddleware, userQueryHandler);
