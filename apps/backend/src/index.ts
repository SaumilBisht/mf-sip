import express from "express"
import cors from "cors"
const app=express();
app.use(express.json());
app.use(cors());

app.get("/",async(req,res)=>{
  return res.json({
    "message":"works fine"
  })
})
app.listen(3002);

