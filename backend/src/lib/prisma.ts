import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function connectDB(){
    try {
        await prisma.$connect();
        console.log("Database connected successfully✅");
    } catch (error) {
        console.log('Error connecting to database', error);
    }
};

connectDB();

export default prisma;