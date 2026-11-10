import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState } from "react";
import { SyncLoader } from "react-spinners";

export default function ChatWindow() {
  const {
    prompt,
    setPrompt,
    setReply,
    currThreadId,
    setPrevChats,
    setNewChat,
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [requestError, setRequestError] = useState(null);

  const getReply = async () => {
    if (!prompt.trim() || loading) return;

    const userPrompt = prompt;
    setLoading(true);
    setRequestError(null);
    setNewChat?.(false);

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userPrompt,
        threadId: currThreadId,
      }),
    };

    try {
      const response = await fetch("http://localhost:8080/api/chat", options);
      const res = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof res.error === "string"
            ? res.error
            : `Chat request failed (${response.status})`,
        );
      }

      if (typeof res.reply !== "string" || !res.reply.trim()) {
        throw new Error("The server returned an invalid reply.");
      }

      setReply(res.reply);
      setPrevChats((prevChats) => [
        ...(prevChats || []),
        { role: "user", content: userPrompt },
        { role: "assistant", content: res.reply },
      ]);
      setPrompt("");
    } catch (err) {
      console.error("Failed to get chat reply:", err);
      setRequestError({
        threadId: currThreadId,
        message:
          err instanceof Error
            ? err.message
            : "Unable to get a response. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  }

  return (
    <div className="chatWindow">
      <div className="navbar">
        <span>
          InferThread<i className="fa-solid fa-chevron-down"></i>
        </span>
        <div className="userIconDiv" onClick={handleProfileClick}>
          <span className="userIcon">
            <i className="fa-solid fa-user"></i>
          </span>
        </div>
      </div>
      {isOpen && (
        <div className="dropDown">
          <div className="dropDownItem">
            <i class="fa-solid fa-gear"></i>Settings
          </div>
          <div className="dropDownItem">
            <i class="fa-solid fa-cloud-arrow-up"></i>Upgrade plan
          </div>
          <div className="dropDownItem">
            <i class="fa-solid fa-arrow-right-from-bracket"></i>Log Out
          </div>
        </div>
      )}
      <Chat />
      <SyncLoader color="#fff" loading={loading} />
      <div className="chatInput">
        {requestError?.threadId === currThreadId && (
          <p className="chatError" role="alert">
            {requestError.message}
          </p>
        )}
        <div className="userInput">
          <input
            placeholder="Ask anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? getReply() : null)}
          />
          <div id="submit" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>
        <p className="info">
          InferThread is AI. By using it, you agree to our <u>Terms</u> & &nbsp;
          <u>Privacy</u> &nbsp; Policy. Chats may be reviewed and used to
          improve our AI models. &nbsp;
          <u>Learn more</u>
        </p>
      </div>
    </div>
  );
}
