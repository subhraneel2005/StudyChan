import { Router } from "express";
import bcrypt from "bcrypt";
import {
  JWT_PASSWORD,
  SigniInSchema,
  SignupSchema,
} from "../zod-types/Authentication";
import prisma from "../lib/prisma";
import jwt from "jsonwebtoken";

export const authRouter = Router();

authRouter.post("/signup", async (req, res) => {
  const { username, email, password } = SignupSchema.parse(req.body);

  if (!username || !password || !email) {
    res.status(400).json({
      message: "Invalid input",
    });
  } else {
    try {
      const hashedPass = await bcrypt.hash(password, 10);
      const userExists = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      const usernameExists = await prisma.user.findUnique({
        where: {
          username,
        },
      });

      if (userExists) {
        res.status(400).json({
          message: "User with the same username already exists",
        });
      };

      if (usernameExists) {
        res.status(400).json({
          message: "Username already taken",
        });
      }

      const user = await prisma.user.create({
        data: {
          username: username,
          email: email,
          password: hashedPass,
        },
      });
      res.status(201).json({
        message: "User created successfully",
        userId: user?.id,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal Server error",
      });
    }
  }
});

authRouter.post("/signin", async (req, res) => {
  const { username, password } = SigniInSchema.parse(req.body);

  if (!username || !password) {
    res.status(400).json({
      message: "Invalid input",
    });
  } else {
    try {
      const user = await prisma.user.findUnique({
        where: {
          username,
        },
      });

      if (!user) {
        res.status(400).json({
          message: "User not found",
        });
      }

      const isValid = await bcrypt.compare(password, user?.password!);
      if (!isValid) {
        res.status(400).json({
          message: "Invalid password",
        });
      }

      const token = jwt.sign(
        {
          userId: user?.id,
        },
        JWT_PASSWORD
      );

      res.status(200).json({
        message: "User logged in successfully",
        token,
      });
    } catch {
      res.status(500).json({
        message: "Internal Server error",
      });
    }
  }
});
