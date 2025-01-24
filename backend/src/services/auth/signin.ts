import bcrypt from "bcrypt";
import {
  JWT_PASSWORD,
  SigniInSchema,
} from "../../zod-types/Authentication";
import prisma from "../../lib/prisma";
import jwt from "jsonwebtoken";

export const signin = async (req:any, res:any) => {
    const { username, password } = SigniInSchema.parse(req.body);
  
    if (!username || !password) {
      return res.status(400).json({
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
          return res.status(400).json({
            message: "User not found",
          });
        }
  
        const isValid = await bcrypt.compare(password, user?.password!);
        if (!isValid) {
          return res.status(400).json({
            message: "Invalid password",
          });
        }
  
        const token = jwt.sign(
          {
            userId: user?.id,
          },
          JWT_PASSWORD
        );
  
        return res.status(200).json({
          message: "User logged in successfully",
          token,
        });
      } catch {
        return res.status(500).json({
          message: "Internal Server error",
        });
      }
    }
  }