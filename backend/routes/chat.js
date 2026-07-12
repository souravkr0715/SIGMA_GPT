import express from "express"
import Thread from "../models/Thread.js"
import getGeminiAPIResponse from "../utils/Gemini.js";

const router = express.Router();

//test
router.post("/test",async(req,res)=>{
    try{
        const thread = new Thread({
            threadId :"abc",
            title:"Testing NEW Thread"
        });

        const response = await thread.save();
        res.send(response);



    }catch(err){
        console.log(err);
       
        res.status(500).json({error:"Failed to save in DB"});
    }
});


//Get all threads
router.get("/thread",async(req,res)=>{
    try{
        const threads = await Thread.find({}).sort({updatedAt:-1});
        //descending order of updatedAt ...most recent data on top
        res.json(threads);
    }catch(err){
        console.log(err);
        res.status(500).json({error:"Failed to fetch threads"});
    }
})

router.get("/thread/:threadId",async(req,res)=>{
    const {threadId}=req.params;
    try{
    const thread = await Thread.findOne({threadId});

        if(!thread ){
            res.status(404).json({error:"The Thread is not Found"});
        }

res.status(200).json(thread.messages);

    }catch(err){
        console.log(err);
        res.status(500).json({error:"Failed to fetch Threads"});
    }
})

router.delete("/thread/:threadId",async(req,res)=>{
    const {threadId} = req.params;
    try{
     const deletedthread =await Thread.findOneAndDelete({threadId});
 if(!deletedthread){
    res.status(404).json({error:"Thread could not be deleted"});


 }
return res.status(200).json({message:"thread deleted successfully"});

    }catch(err){
        console.log(err);
        res.status(500).json({error:"Failed to delete thread"});
    }
})


router.post("/chat",async(req,res)=>{
const {threadId , message} =req.body;


if(!threadId || !message){
    res.status(400).json({error:"missing required fields"});
}

try{

let thread = await Thread.findOne({threadId});

if(!thread){
    //create a new thread in Db
    thread = new Thread({
        threadId,
        title:message,
        messages:[{role:"user",content:message}]
    })
}else{
    thread.messages.push({role:"user",content:message});
}

const assitantreply = await getGeminiAPIResponse(message);

thread.messages.push({role:"assistant",content:assitantreply});
thread.updtaedAt = new Date();
await thread.save();
res.json({reply:assitantreply});


}catch(err){
    console.log(err);
    res.status(500).json({error:"something went wrong"});
}


})


export default router