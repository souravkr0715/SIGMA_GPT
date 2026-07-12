import { GoogleGenAI } from "@google/genai";
import express from "express"
import "dotenv/config";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import cors from "cors";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

app.use("/api",chatRoutes)

const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected with Db!");

    }catch(err){
        console.log("Failed to connect DB!",err)
    }
}

app.listen(PORT,()=>{
    console.log(`Server running on ${PORT}`)
    connectDB();
})


// app.post("/test",async(req , res)=>{
//     const model = "gemini-2.5-flash";
//     const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
//     const options = {
//         method:"POST",
//         headers:{
//           "Content-Type": "application/json",
//             // 2. Correct authentication header format
//             "x-goog-api-key": process.env.GEMINI_API_KEY
//         },
//         body: JSON.stringify({
//             contents: [
//                 {
//                     role: "user",
//                     parts: [{ text:req.body.message }]
//                 }
//             ]
//         })
//     };
//     try {
//        const response = await fetch(url, options);
//        const data = await response.json();
       
//        //console.log(data.candidates[0].content.parts[0].text);
//        res.send(data.candidates[0].content.parts[0].text);
//     } catch (err) {
//         console.error("Fetch Error:", err);
//         res.status(500).send({ error: "Failed to communicate with Gemini API" });
//     }
// });
// // const ai = new GoogleGenAI({
// //   apiKey: process.env.GEMINI_API_KEY,
// // });

// // const response = await ai.models.generateContent({
// //   model: "gemini-2.5-flash",
// //   contents: "difference between sql and mongodb",
// // });

// // console.log(response.text);