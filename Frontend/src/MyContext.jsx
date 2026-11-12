import React, { createContext, useState } from "react";
import { v1 as uuidv1 } from "uuid";

export const MyContext = createContext(null);

export const MyContextProvider = ({ children }) => {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

  // Auth states from localStorage --> so progress is not removed on refresh (F5)
  const [token, setToken] = useState(
    () => localStorage.getItem("inferthread_token") || null,
  );

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("inferthread_user");
    try {
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Auth Handlers
  const loginUser = (tokenData, userData) => {
    localStorage.setItem("inferthread_token", tokenData);
    localStorage.setItem("inferthread_user", JSON.stringify(userData));
    setToken(tokenData);
    setUser(userData);
  };

  const logoutUser = () => {
    localStorage.removeItem("inferthread_token");
    localStorage.removeItem("inferthread_user");
    setToken(null);
    setUser(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
    setAllThreads([]);
    setPrompt("");
    setReply(null);
    setNewChat(true);
  };

  // Authenticated fetch wrapper for API calls
  const authFetch = async (url, options = {}) => {
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const res = await fetch(url, { ...options, headers });

    if (res.status === 401) {
      logoutUser();
    }

    return res;
  };

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
        allThreads,
        setAllThreads,
        token,
        user,
        loginUser,
        logoutUser,
        authFetch,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};
