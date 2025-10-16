import express from "express"
import cors from "cors"
import { authRouter } from "./routes/auth.js";
import { userRouter } from "./routes/user.js";

const app=express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3001", 
    credentials: true,       // allow cookies/auth headers
  })
);

app.get("/",async(req,res)=>{
  return res.json({
    "message":"works fine"
  })
})

app.use('/auth', authRouter);
app.use('/user', userRouter);

app.listen(3002);

