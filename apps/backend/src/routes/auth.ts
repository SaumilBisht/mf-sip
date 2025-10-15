import { prisma } from 'db/client';
import express from 'express';
import jwt from "jsonwebtoken"
import { Router } from 'express';
import cookieParser from "cookie-parser"
const router: Router = express.Router();
router.use(cookieParser())
router.post("/sync", async (req, res) => {

  try{
    const { email, name } = req.body
    if (!email || !name) return res.status(400).json({ error: "Email and name required" })

    let user = await prisma.user.findUnique({ where: { email } })

    //new user with google auth completed
    if (!user) 
    {
      user = await prisma.user.create({
        data: {
          email,
          fullName: name,
          currentStep: 1,
          phone:"",
          encryptedPan:""
        }
      }) as any;
    }

    if (!user) {
      return res.status(500).json({ error: "User creation failed" })
    }

    
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    )

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return res.json({
      success: true,
      currentStep: user.currentStep,
    });
  }
  catch (err) {
    console.error("Error in /auth/sync:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
})


router.post("/signout", async (req, res) => {

  res.clearCookie("auth_token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })
  return res.json({ success: true })
})

export  {router as authRouter};