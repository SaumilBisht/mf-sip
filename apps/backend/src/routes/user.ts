import { prisma } from 'db/client';
import express from 'express';
import { Router } from 'express';
import cookieParser from "cookie-parser"
import { verifyAuth } from '../middlewares/auth.js';
const router: Router = express.Router();
router.use(cookieParser())


router.get("/status", verifyAuth, async (req, res) => {
  console.log("Status Check pe pahunch Gye");
  try{
    const user = await prisma.user.findUnique({//@ts-ignore
      where: { id: req.user.userId },
      select: { currentStep: true },
    })
    if (!user) return res.status(404).json({ error: "User not found" })
    res.json({ currentStep: user.currentStep })
  }
  catch(e){
    console.log(e);
  }
})

export  {router as userRouter};