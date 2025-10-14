import express from "express"
import cors from "cors"
import {prisma} from "db/client" 

const app=express();
app.use(express.json());
app.use(cors());

app.get("/",async(req,res)=>{
  return res.json({
    "message":"works fine"
  })
})

app.get("/details/cred",async(req,res)=>{
  
})
app.listen(3002);

