import React, { useContext,useState ,useEffect} from "react";
import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import MyContext from "./MyContext.jsx";
import {ScaleLoader } from "react-spinners"



export default function ChatWindow() {

  const{prompt , setPrompt , reply , setReply , currThreadId , prevChats , setPrevChats ,setNewChat} = useContext(MyContext);
const [loading , setLoading] = useState(false);
const getReply = async () =>{
  setLoading(true);
  setNewChat(false);
  console.log("message",prompt,"threadId",currThreadId)
  const options = {
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body: JSON.stringify({
      message:prompt,
      threadId:currThreadId
    })
  };
  try{
   const response= await fetch("http://localhost:8080/api/chat",options);
   const res = await response.json()
   
   setReply(res.reply);

  }catch(err){
    console.log(err);
  }
  setLoading(false);
}

//Append new chat to prevChats
useEffect(()=>{
  if(prompt && reply){
   setPrevChats(prevChats => [
  ...prevChats,
  {
    role: "user",
    content: prompt,
  },
  {
    role: "assistant",
    content: reply,
  },
]);
  }
  setPrompt("");
},[reply])



  return (
    <>
      <div className="chatWindow">
        <div className="navbar">
          <span>
            SigmaGPT <i className="fa-solid fa-chevron-down"></i>
          </span>
          <div className="userIconDiv">
            <span className="userIcon">
              {" "}
              <i className="fa-solid fa-user"></i>
            </span>
          </div>
        </div>
        <Chat></Chat>

        <ScaleLoader color="#fff" loading={loading}></ScaleLoader>

        <div className="chatInput">
  <div className="userInput">
    <input placeholder="Ask anything"  value = {prompt}
    onChange ={(e)=>setPrompt(e.target.value)}
    onKeyDown={(e)=>e.key === 'Enter'?getReply():''}
    >
   
    </input>

    <div id="submit" onClick={getReply}>
      <i className="fa-solid fa-paper-plane"></i>
    </div>
  </div>

  <p className="info">
    SigmaGPT can make mistakes. Check important info.
  </p>
</div>
        </div>
      
    </>
  );
}
