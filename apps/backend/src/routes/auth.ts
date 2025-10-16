import { prisma } from 'db/client';
import express from 'express';
import jwt from "jsonwebtoken"
import { Router } from 'express';
import cookieParser from "cookie-parser"
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import {requestOTPSchema,verifyOTPSchema} from "common/otp"
import axios from "axios"
import { setKey, getKey, delKey } from "redis-service/otp";
import { verifyAuth } from '../middlewares/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const router: Router = express.Router();
router.use(cookieParser())
router.post("/sync", async (req, res) => {

  console.log("reached google signin")
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
      })
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
  console.log("reached google signout")
  try{
    res.clearCookie("auth_token", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })
    return res.json({ success: true })
  }
  catch(e){
    console.log(e);
  }
})

const MSG91_AUTH_KEY = process.env.AUTH_KEY; 
const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const MAX_RETRIES = 5;

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

router.post("/otp", verifyAuth,async (req, res) => {
  try {
    const data = requestOTPSchema.parse(req.body);
    const mobile = data.mobile;

    const otp = generateOTP();
    const expires = Date.now() + OTP_EXPIRY_MS;
    const OTP_EXPIRY_SEC = 300;//seconds

    await setKey(`otp:${mobile}`, { otp, retries: 0 }, OTP_EXPIRY_SEC);

    //send via MSG91
    const msg = `Your verification code is ${otp}`;
    await axios.get("https://api.msg91.com/api/v5/otp", {
      params: {
        template_id: process.env.DLT_TEMPLATE_ID,
        mobile: `91${mobile}`, //India only
        authkey: MSG91_AUTH_KEY,
        otp,
      },
    });

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (err: any) 
  {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/otp/verify", verifyAuth ,async(req, res) => {
  try {
    const data = verifyOTPSchema.parse(req.body);
    const mobile = data.mobile;
    const otp = data.otp;

    const record = await getKey(`otp:${mobile}`);
    if (!record) return res.status(400).json({ message: "No OTP sent" });

    if (record.retries >= MAX_RETRIES) return res.status(429).json({ message: "Max retries exceeded" });

    if (record.otp !== otp) {
      record.retries += 1;
      await setKey(`otp:${mobile}`, record, 300); 
      return res.status(400).json({ message: `Invalid OTP. Attempts left: ${MAX_RETRIES - record.retries}` });
    }

    await delKey(`otp:${mobile}`);

    await prisma.user.update({
      where:{//@ts-ignore
        id:req.user.userId
      },
      data:{
        phone:mobile,
        currentStep:2
      }
    })
    return res.json({ success: true, message: "OTP verified successfully" });

  } 
  catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


export  {router as authRouter};