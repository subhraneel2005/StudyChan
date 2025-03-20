import {Router} from "express";
import multer from 'multer';
import { uploadFile } from "../services/upload/uploadToSupabase";
import { extractTextFromPdf } from "../services/upload/parsePdfToText";
import { langchainSplitText } from "../services/processing/textSplitting";
import { storePineconeVectors } from "../services/vector-database/pineconeStore";
import { authMiddleware } from "../middlewares/authMiddleware";
import prisma from "../lib/prisma";

export const uploadRouter = Router();

const upload = multer({storage: multer.memoryStorage()});

uploadRouter.post("/upload", authMiddleware, upload.single('file'), async(req:any,res) => {

    const userId = req.userId;
    try {
        if(!req.file){
            res.status(404).json({
                message: "No file provided"
            })
        }
        if(!req.file?.mimetype.includes('pdf') || !req.file?.mimetype){
            res.status(401).json({
                message: "File type should only be pdf"
            })
        }

        const uploadedFile = await uploadFile(req.file!);
        const parsedText = await extractTextFromPdf(req.file?.buffer!);
        const splitedText = await langchainSplitText(parsedText!);

        const storeToPineconeDatabase = await storePineconeVectors(
            uploadedFile.fileName,
            splitedText
        )

        const pineconeData = await prisma.pineconeVectorData.create({
            data: {
                documentId: storeToPineconeDatabase.documentId,
                totalVectors: storeToPineconeDatabase.totalVectors
            }
        })

        const savedDataToPostgres = await prisma.document.create({
            data:{
                fileName: uploadedFile?.fileName,
                originalName: uploadedFile?.originalName,
                publicUrl: uploadedFile?.publicUrl,
                parsedText: parsedText!,
                PineconeData: {
                    connect: {
                        id: pineconeData.id,
                    },
                },
                user:{
                    connect:{
                        id: userId
                    }
                }
            }
        })
        
        res.status(200).json({
            message: "Postgres Database service successfull",
            savedDataToPostgres
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });

        console.log('Error: '+ error);
    }

})
