// import React, { useContext, useState, useEffect } from "react";
// import "./ChatWindow.css";
// import Chat from "./Chat.jsx";
// import MyContext from "./MyContext.jsx";
// import { ScaleLoader } from "react-spinners";

// export default function ChatWindow() {
//   const {
//     prompt,
//     setPrompt,
//     reply,
//     setReply,
//     currThreadId,
//     prevChats,
//     setPrevChats,
//     setNewChat,
//   } = useContext(MyContext);
//   const [loading, setLoading] = useState(false);
//   const getReply = async () => {
//     setLoading(true);
//     setNewChat(false);
//     console.log("message", prompt, "threadId", currThreadId);
//     const options = {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         message: prompt,
//         threadId: currThreadId,
//       }),
//     };
//     try {
//       const response = await fetch("http://localhost:8080/api/chat", options);
//       const res = await response.json();

//       setReply(res.reply);
//     } catch (err) {
//       console.log(err);
//     }
//     setLoading(false);
//   };

//   //Append new chat to prevChats
//   useEffect(() => {
//     if (prompt && reply) {
//       setPrevChats((prevChats) => [
//         ...prevChats,
//         {
//           role: "user",
//           content: prompt,
//         },
//         {
//           role: "assistant",
//           content: reply,
//         },
//       ]);
//     }
//     setPrompt("");
//   }, [reply]);

//   return (
//     <>
//       <div className="chatWindow">
//         <div className="navbar">
//           <span>
//             SigmaGPT <i className="fa-solid fa-chevron-down"></i>
//           </span>
//           <div className="userIconDiv">
//             <span className="userIcon">
//               {" "}
//               <i className="fa-solid fa-user"></i>
//             </span>
//           </div>
//         </div>
//         <Chat></Chat>

//         <ScaleLoader color="#fff" loading={loading}></ScaleLoader>

//         <div className="chatInput">
//           <div className="userInput">
//             <input
//               placeholder="Ask anything"
//               value={prompt}
//               onChange={(e) => setPrompt(e.target.value)}
//               onKeyDown={(e) => (e.key === "Enter" ? getReply() : "")}
//             />

//             <div id="submit" onClick={getReply}>
//               <i className="fa-solid fa-paper-plane"></i>
//             </div>
//           </div>

//           <p className="info">
//             SigmaGPT can make mistakes. Check important info.
//           </p>
//         </div>
//       </div>
//     </>
//   );
// }

import React, { useContext, useState } from "react";
import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import MyContext from "./MyContext.jsx";
import { ScaleLoader } from "react-spinners";

export default function ChatWindow() {
  const {
    prompt,
    setPrompt,
    setReply,
    currThreadId,
    setPrevChats,
    setNewChat,
    setAllThreads,
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const getReply = async () => {
    // Don't send empty message
    if (!prompt.trim()) return;

    // Store prompt before clearing input
    const currentPrompt = prompt;

    // Clear input immediately
    setPrompt("");

    setLoading(true);
    setNewChat(false);

    console.log("message:", currentPrompt, "threadId:", currThreadId);

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: currentPrompt,
        threadId: currThreadId,
      }),
    };

    try {
      const response = await fetch("http://localhost:8080/api/chat", options);

      const res = await response.json();

      // Check API error
      if (!response.ok) {
        throw new Error(res.error || "Failed to get response");
      }

      // Store latest Gemini reply
      // Used by Chat.jsx for typing animation
      setReply(res.reply);

      // Add user message + AI response
      // to current conversation
      setPrevChats((prev) => [
        ...prev,
        {
          role: "user",
          content: currentPrompt,
        },
        {
          role: "assistant",
          content: res.reply,
        },
      ]);

      // Update sidebar history
      setAllThreads((prev) => {
        // Check if thread already exists
        const threadExists = prev.some(
          (thread) => thread.threadId === currThreadId,
        );

        // If already exists, don't add again
        if (threadExists) {
          return prev;
        }

        // Add new conversation to sidebar
        return [
          {
            threadId: currThreadId,
            title: currentPrompt,
          },
          ...prev,
        ];
      });
    } catch (err) {
      console.error("Chat API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="chatWindow">
        <div className="navbar">
          <span>
            SigmaGPT <i className="fa-solid fa-chevron-down"></i>
          </span>

<div className="userIconDiv">

  <span
    className="userIcon"
    onClick={() => setShowProfileMenu(!showProfileMenu)}
  >
    <i className="fa-solid fa-user"></i>
  </span>

  {showProfileMenu && (
    <div className="profileDropdown">

      <div className="profileMenuItem">
        <i className="fa-solid fa-user"></i>
        <span>Profile</span>
      </div>

      <div className="profileMenuItem">
        <i className="fa-solid fa-gear"></i>
        <span>Settings</span>
      </div>

      <div className="profileMenuDivider"></div>

      <div className="profileMenuItem logout">
        <i className="fa-solid fa-right-from-bracket"></i>
        <span>Log out</span>
      </div>

    </div>
  )}

</div>
        </div>

        <Chat />

        <ScaleLoader color="#fff" loading={loading} />

        <div className="chatInput">
          <div className="userInput">
            <input
              placeholder="Ask anything"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) {
                  getReply();
                }
              }}
            />

            <div
              id="submit"
              onClick={() => {
                if (!loading) {
                  getReply();
                }
              }}
            >
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
