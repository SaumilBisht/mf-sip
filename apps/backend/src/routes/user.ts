import { prisma } from 'db/client';
import express from 'express';
import { Router } from 'express';
import cookieParser from "cookie-parser"
import { verifyAuth } from '../middlewares/auth.js';
import { personalInfoSchema,financialInfoSchema } from 'common/otp';

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
router.post("/personal", verifyAuth,async (req, res) => {
  //@ts-ignore
  const userId = req.user?.userId;

  const parsed = personalInfoSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: "Invalid Details Format"});
  }

  const data = parsed.data;

  try 
  {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        fatherName: data.fatherName,
        motherName: data.motherName,
        dob: data.dob ? new Date(data.dob) : undefined,
        maritalStatus: data.maritalStatus,
        education: data.education,
        gender: data.gender,
        residentialStatus: data.residentialStatus,
        occupationType: data.occupationType,
        countryOfBirth: data.countryOfBirth,
        nationality: data.nationality,
        currentStep: { increment: 1 },
      },
    });

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to update personal info" });
  }
});

router.post("/user/finance",verifyAuth, async (req, res) => {
  //@ts-ignore
  const userId = req.user?.userId;

  const parsed = financialInfoSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: "Invalid Input"});
  }

  const data = parsed.data;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        annualIncome: data.annualIncome,
        incomeSource: data.incomeSource,
        taxResidency: data.taxResidency,
        currentStep: { increment: 1 },
      },
    });

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to update financial info" });
  }
});


export  {router as userRouter};