import { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import ChatroomPage from "./pages/ChatroomPage";
import DashboardPage from "./pages/DashboardPage";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { io } from "socket.io-client";
import "./styles/common.css";
import makeToast from "./Toaster";

function App() {
  const [socket, setSocket] = useState(null);

  const setupSocket = () => {
    const token = localStorage.getItem("token");
    if (token && token.length > 0 && !socket) {
      const socketConn = io("http://localhost:5000", {
        transports: ["websocket"],
        query: {
          token: localStorage.getItem("token"),
        },
      });
      socketConn.on("disconnect", () => {
        setSocket(null);
        setTimeout(setupSocket, 3000);
        makeToast("error", "Socket Disconnected!");
      });
      socketConn.on("connect", socket => {
        makeToast("success", "Socket Connected!");
      });
      setSocket(socketConn);
    }
  };

  useEffect(() => {
    setupSocket();
  }, []);

  const token = localStorage.getItem("token");

  let isLoggedIn;
  if (token) {
    isLoggedIn = true;
  } else {
    isLoggedIn = false;
  }

  return (
    <Routes>
      <Route path="/" element={<IndexPage />} exact />
      <Route
        path="/login"
        // render={() =>
        //   isLoggedIn ? (
        //     <Navigate to="/dashboard" />
        //   ) : (
        //     <LoginPage setupSocket={setSocket} />
        //   )
        // }
        element={
          isLoggedIn ? (
            <Navigate to="/dashboard" /> // Navigate is used in place of Redirect
          ) : (
            <LoginPage setupSocket={setupSocket} />
          )
        }
        exact
      />
      <Route
        path="/register"
        element={isLoggedIn ? <Navigate to="/dashboard" /> : <RegisterPage />}
        exact
      />
      <Route
        path="/dashboard"
        element={
          isLoggedIn ? (
            <DashboardPage socket={socket} />
          ) : (
            <Navigate to="/login" />
          )
        }
        exact
      />
      <Route
        path="/chatroom/:id"
        element={
          isLoggedIn ? (
            <ChatroomPage socket={socket} />
          ) : (
            <Navigate to="/login" />
          )
        }
        exact
      />
    </Routes>
  );
}

export default App;
