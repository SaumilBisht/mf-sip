import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { verifyAuth } from '../middlewares/auth.js';
import { Router } from 'express';
import express from "express"
import cookieParser from "cookie-parser";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import multer from "multer";
import {prisma} from "db/client"

const router: Router = express.Router();
router.use(cookieParser())

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

async function uploadToS3(fileBuffer: Buffer, fileName: string, mimeType: string) {
  const bucketName = process.env.AWS_BUCKET_NAME!;
  const params = {
    Bucket: bucketName,
    Key: `signatures/${fileName}`,
    Body: fileBuffer,
    ContentType: mimeType,
  };
  await s3.send(new PutObjectCommand(params));
  return `https://${bucketName}.s3.amazonaws.com/signatures/${fileName}`;
}

const upload = multer({ limits: { fileSize: 50 * 1024 } }); // 50 KB

router.post("/user", verifyAuth, upload.single("signature"), async (req, res) => {
  console.log("Reached Post signature")
  try {
    // @ts-ignore
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const mimeType = req.file.mimetype;
    if (!["image/png", "image/jpeg", "image/jpg"].includes(mimeType))
      return res.status(400).json({ message: "Invalid file type" });

    const fileName = `${userId}-${Date.now()}.png`;
    const s3Url = await uploadToS3(req.file.buffer, fileName, mimeType);

    console.log("Posted to s3",s3Url)
    await prisma.user.update({
      where: { id: userId },
      data: { 
        signatureUrl: s3Url,
        currentStep: { increment: 1 }
      }
    });

    res.json({ success: true, signatureKey: s3Url });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
});

router.get("/user", verifyAuth, async (req, res) => {
  try {
    // @ts-ignore
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { signatureUrl: true },
    });

    if (!user || !user.signatureUrl)
      return res.status(404).json({ message: "No signature found" });

    res.json({ signatureUrl: user.signatureUrl });
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ message: "Failed to fetch signature" });
  }
});

export { router as signRouter };