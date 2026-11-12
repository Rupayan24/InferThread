import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { apiUrl } from "./api.js";
import { v1 as uuidv1 } from "uuid";
import logo from "./assets/blacklogo.png";

function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats,
    authFetch,
  } = useContext(MyContext);

  const getAllThreads = async () => {
    try {
      const response = await authFetch(apiUrl("/api/thread"));
      const res = await response.json();

      if (response.ok && Array.isArray(res)) {
        const filteredData = res.map((thread) => ({
          threadId: thread.threadId,
          title: thread.title,
        }));
        setAllThreads(filteredData);
      }
    } catch (err) {
      console.error("Failed to fetch threads:", err);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currThreadId]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  const changeThread = async (newThreadId) => {
    if (newThreadId === currThreadId) return;

    setCurrThreadId(newThreadId);

    try {
      const response = await authFetch(
        apiUrl(`/api/thread/${newThreadId}`),
      );
      const res = await response.json();

      if (response.ok && Array.isArray(res)) {
        setPrevChats(res);
        setNewChat(false);
        setReply(null);
      }
    } catch (err) {
      console.error("Failed to load thread messages:", err);
    }
  };

  const deleteThread = async (threadId) => {
    try {
      const response = await authFetch(
        apiUrl(`/api/thread/${threadId}`),
        {
          method: "DELETE",
        },
      );
      const res = await response.json();

      if (response.ok) {
        // Update local state without needing a full refetch
        setAllThreads((prev) =>
          prev.filter((thread) => thread.threadId !== threadId),
        );

        if (threadId === currThreadId) {
          createNewChat();
        }
      } else {
        console.error("Delete failed:", res);
      }
    } catch (err) {
      console.error("Failed to delete thread:", err);
    }
  };

  return (
    <section className="sidebar">
      <button onClick={createNewChat}>
        <img className="logo" src={logo} alt="gpt logo" />
        <span>
          <i className="fa-solid fa-pen-to-square"></i>
        </span>
      </button>

      <ul className="history">
        {allThreads?.map((thread) => (
          <li
            key={thread.threadId}
            onClick={() => changeThread(thread.threadId)}
            className={thread.threadId === currThreadId ? "highlighted" : ""}
          >
            {thread.title}
            <i
              className="fa-solid fa-trash"
              onClick={(e) => {
                e.stopPropagation(); // Stop click from triggering changeThread
                deleteThread(thread.threadId);
              }}
            ></i>
          </li>
        ))}
      </ul>

      <div className="sign">
        <p>By Rupayan &hearts;</p>
      </div>
    </section>
  );
}

export default Sidebar;
