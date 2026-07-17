// import React from "react";
// import "./Chat.css";
// import { useContext, useState, useEffect } from "react";
// import MyContext from "./MyContext";
// import ReactMarkdown from "react-markdown";
// import rehypeHighlight from "rehype-highlight";
// import "highlight.js/styles/github-dark.css";

// export default function Chat() {
//   const { newChat, prevChats, reply } = useContext(MyContext);
//   const [latestReply, setLatestReply] = useState(null);

//   useEffect(() => {
//     if (!prevChats?.length || !reply) return;

//     const content = reply.split(" ");

//     let idx = 0;

//     const interval = setInterval(() => {
//       setLatestReply(content.slice(0, idx + 1).join(" "));
//       idx++;

//       if (idx >= content.length) {
//         clearInterval(interval);
//       }
//     }, 20);

//     return () => clearInterval(interval);
//   }, [prevChats, reply]);

//   return (
//     <>
//       {newChat && <h1>Start a New Chat!</h1>}
//       <div className="chats">
//         {prevChats?.slice(0, -1).map((chat, idx) => (
//           <div
//             className={chat.role === "user" ? "userDiv" : "gptDiv"}
//             key={idx}
//           >
//             {chat.role === "user" ? (
//               <p className="userMessage">{chat.content}</p>
//             ) : (
//               <ReactMarkdown rehypePlugins={rehypeHighlight}>
//                 {chat.content}
//               </ReactMarkdown>
//             )}
//           </div>
//         ))}
//         {prevChats.length > 0 && latestReply !== null && (
//           <div className="gptDiv" key={"typing"}>
//             <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
//               {latestReply}
//             </ReactMarkdown>
//           </div>
//         )}

//         {prevChats.length > 0 && latestReply === null && (
//           <div className="gptDiv" key={"non-typing"}>
//             <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
//               {prevChats[prevChats.length - 1].content}
//             </ReactMarkdown>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

import React, { useContext, useState, useEffect } from "react";

import "./Chat.css";
import MyContext from "./MyContext";

import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

import "highlight.js/styles/github-dark.css";

export default function Chat() {
  const { newChat, prevChats, reply } = useContext(MyContext);

  const [latestReply, setLatestReply] = useState(null);

  // Typing animation for latest AI reply
  useEffect(() => {
    if (!reply) {
      setLatestReply(null);
      return;
    }

    const content = reply.split(" ");

    let idx = 0;

    // Reset previous animation
    setLatestReply("");

    const interval = setInterval(() => {
      setLatestReply(content.slice(0, idx + 1).join(" "));

      idx++;

      if (idx >= content.length) {
        clearInterval(interval);
      }
    }, 20);

    return () => {
      clearInterval(interval);
    };
  }, [reply]);

  return (
    <>
      <div className="chats">

      {newChat && (
        <div className="newChatWelcome">
          <h1>How can I help you today?</h1>
          <p>Ask SigmaGPT anything to get started.</p>
        </div>
      )}


        {prevChats?.slice(0, -1).map((chat, idx) => (
          <div
            className={chat.role === "user" ? "userDiv" : "gptDiv"}
            key={idx}
          >
            {chat.role === "user" ? (
              <p className="userMessage">{chat.content}</p>
            ) : (
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {chat.content}
              </ReactMarkdown>
            )}
          </div>
        ))}

        {/* Latest AI response with animation */}

        {latestReply !== null && prevChats.length > 0 && (
          <div className="gptDiv">
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {latestReply}
            </ReactMarkdown>
          </div>
        )}

        {/* 
          If there is no new reply animation,
          show the last message normally.
          Useful when loading an old thread.
        */}

        {latestReply === null && prevChats.length > 0 && (
          <div
            className={
              prevChats[prevChats.length - 1].role === "user"
                ? "userDiv"
                : "gptDiv"
            }
          >
            {prevChats[prevChats.length - 1].role === "user" ? (
              <p className="userMessage">
                {prevChats[prevChats.length - 1].content}
              </p>
            ) : (
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {prevChats[prevChats.length - 1].content}
              </ReactMarkdown>
            )}
          </div>
        )}
      </div>
     
    </>
  );
}
