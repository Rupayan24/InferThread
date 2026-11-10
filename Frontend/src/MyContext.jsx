import React, { createContext, useState } from "react";

export const MyContext = createContext(null);

export const MyContextProvider = ({ children }) => {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(null);
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);

  return (
    <MyContext.Provider
      value={{
        prompt,
        setPrompt,
        reply,
        setReply,
        currThreadId,
        setCurrThreadId,
        prevChats,
        setPrevChats,
        newChat,
        setNewChat,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};
