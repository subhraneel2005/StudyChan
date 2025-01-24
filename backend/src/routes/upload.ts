import {Router} from "express";
import multer from 'multer';
import { uploadFile } from "../services/upload/uploadToSupabase";
import { extractTextFromPdf } from "../services/upload/parsePdfToText";
import { langchainSplitText } from "../services/processing/textSplitting";

export const uploadRouter = Router();

const upload = multer({storage: multer.memoryStorage()});

uploadRouter.post("/upload", upload.single('file'), async(req:any,res) => {

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
        const splitedText = await langchainSplitText(parsedText!)

        res.status(200).json({
            message: "Upload service working successfully",
            data: {
                uploadedFile,
                parsedText,
                langchainSplitedText: splitedText
            }
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });

        console.log('Error: '+ error);
    }

})
