import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { UserQuerySchema } from "../zod-types/UserQuery";
import { semanticSearch } from "../services/ai/semanticSearch";
import { generateAIResponse } from "../services/ai/aiResponse";
import prisma from "../lib/prisma";

export const userQueryRouter = Router();

const createChat = async(req:any, res:any) =>{
  try {
    const userId = req.userId;
    console.log(userId);
    
    const newChat = await prisma.chat.create({
      data: {
       userId: userId
      }
    });

    return res.status(200).json({
      message: "New chat created successfully",
      chatId: newChat.id
    })
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error
    })
  }
}

const userQueryHandler = async (req: any, res: any) => {
  try {
    const userId = req.userId;
    const chatId = req.params.chatId;

    const chat = await prisma.chat.findUnique({
      where: {
          id: chatId,
      },
    });

    if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
    }
    const { userQuery, fileName } = UserQuerySchema.parse(req.body);

    const document = await prisma.document.findFirst({
      where: {
        fileName: fileName,
      },
  });
  
  if (!document) {
      return res.status(404).json({ message: "Document not found" });
  }

    if (!chat.documentId) {
      await prisma.chat.update({
          where: {
              id: chatId,
          },
          data: {
              documentId: fileName,
            },
        });
    }

    await prisma.message.create({
      data: {
          chatId: chatId,
          content: userQuery,
          role: "user",
      },
  });

    const relevantChunks = await semanticSearch(userQuery, fileName);
    const aiResponse = await generateAIResponse(userQuery, relevantChunks!);

    await prisma.message.create({
      data: {
          chatId: chatId,
          content: aiResponse.answer,
          role: "assistant",
      },
  });

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

const deleteChat = async (req: any, res: any) => {
  try {
    const chatId = req.params.chatId;

    // Check if the chat exists
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
      include: {
        messages: true, // Include related messages to delete them first
      },
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Delete all related messages first
    await prisma.message.deleteMany({
      where: {
        chatId: chatId,
      },
    });

    // Delete the chat
    await prisma.chat.delete({
      where: {
        id: chatId,
      },
    });

    return res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Error deleting chat:", error); // Log the full error for debugging
    return res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
};

const getChatMessages = async (req: any, res: any) => {
  try {
    const chatId = req.params.chatId;

    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Get the document information if documentId exists
    let document = null;
    if (chat.documentId) {
      document = await prisma.document.findFirst({
        where: {
          fileName: chat.documentId
        },
        select: {
          fileName: true,
          originalName: true
        }
      });
    }

    return res.status(200).json({
      chat,
      document
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error
    });
  }
};

userQueryRouter.delete("/chat/:chatId", authMiddleware, deleteChat);

userQueryRouter.post("/chat", authMiddleware, createChat);
userQueryRouter.post("/ask/:chatId", authMiddleware, userQueryHandler);

userQueryRouter.get("/chat/:chatId", authMiddleware, getChatMessages);
