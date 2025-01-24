import prisma from "../../lib/prisma";
import { SignupSchema } from "../../zod-types/Authentication";
import bcrypt from "bcrypt";

export const signup = async (req:any, res:any) => {
    const { username, email, password } = SignupSchema.parse(req.body);
  
    if (!username || !password || !email) {
      return res.status(400).json({
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
          return res.status(400).json({
            message: "User with the same username already exists",
          });
        };
  
        if (usernameExists) {
          return res.status(401).json({
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
        return res.status(201).json({
          message: "User created successfully",
          userId: user?.id,
        });
      } catch (error) {
          return res.status(500).json({
          message: "Internal Server error",
        });
      }
    }
  }