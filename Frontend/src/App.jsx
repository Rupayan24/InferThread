import "./App.css";
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import AuthModal from "./AuthModal.jsx";
import { MyContext, MyContextProvider } from "./MyContext.jsx";
import { useContext } from "react";


const AppContent = () => {
  const { token } = useContext(MyContext);

  if (!token) {
    return <AuthModal />
  }


  return (
    <div className="app">
      <Sidebar />
      <ChatWindow />
    </div>
  );
};


function App() {
  return (
    <MyContextProvider>
      <AppContent />
    </MyContextProvider>
  );
}


export default App;