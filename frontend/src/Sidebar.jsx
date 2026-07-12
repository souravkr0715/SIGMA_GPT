import React, { useEffect } from "react";
import "./Sidebar.css";
import { useContext } from "react";
import MyContext from "./MyContext";
import { v1 as uuidv1 } from "uuid";


export default function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setCurrThreadId,
    setPrevChats,
    setPrompt,
    setReply,
  } = useContext(MyContext);

  const getAllThreads = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/thread");
      const res = await response.json();
      const filteredData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));

      setAllThreads(filteredData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllThreads();
  });

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);

    try {
      const response = await fetch(
        `http://localhost:8080/api/thread/${newThreadId}`,
      );
      const res = await response.json();
      console.log(res);
      setPrevChats(res);
      setNewChat(false);
    } catch (err) {
      console.log(err);
    }
  };


  const deleteThread = async(threadId)=>{
    try{
     const response = await fetch(
        `http://localhost:8080/api/thread/${threadId}`,{method:"DELETE"},
      );
      const res = await response.json();
      console.log(res);

      setAllThreads(prev => prev.filter(thread=>thread.threadId !== threadId));

      if(threadId === currThreadId){
        createNewChat();
      }
    }catch(err){
      console.log(err);
    }
  }

  return (
    <section className="sidebar">
      {/* {new chat button} */}
      <button className="button" onClick={createNewChat}>
        <img src="src/assets/logo.avif" alt="GPT logo" className="logo"></img>
        <span>
          {" "}
          <i className="fa-solid fa-pen-to-square"></i>
        </span>
      </button>

      {/* {history} */}
      <ul className="history">
        {allThreads?.map((thread, idx) => (
          <li key={idx} onClick={(e) => changeThread(thread.threadId)}>
            {thread.title}
            <i className="fa-solid fa-trash" onClick={(e)=>{
              e.stopPropagation();
              deleteThread(thread.threadId);
            }}></i>
          </li>
        ))}
      </ul>
      {/* {sign} */}
      <div className="sign">
        <p>By ApnaCollege &hearts;</p>
      </div>
    </section>
  );
}
