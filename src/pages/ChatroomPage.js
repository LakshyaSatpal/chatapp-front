import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "../styles/chatroom.css";

const b64DecodeUnicode = str =>
  decodeURIComponent(
    Array.prototype.map
      .call(
        atob(str),
        c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
      )
      .join("")
  );

const parseJwt = token =>
  JSON.parse(
    b64DecodeUnicode(token.split(".")[1].replace("-", "+").replace("_", "/"))
  );

function ChatroomPage({ socket }) {
  const params = useParams();
  const chatroomId = params.id;
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState("");
  const messageRef = useRef();

  const sendMessage = () => {
    if (socket) {
      socket.emit("chatroomMessage", {
        chatroomId,
        message: messageRef.current.value,
      });
    }
    messageRef.current.value = "";
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = parseJwt(token);
      setUserId(payload.id);
    }
    if (socket) {
      socket.on("newMessage", payload => {
        const newMessages = messages.concat(payload);
        setMessages(newMessages);
      });
    }
  }, [messages]);

  useEffect(() => {
    if (socket) {
      socket.emit("joinRoom", {
        chatroomId,
      });
    }
    return () => {
      // Component unmount
      socket.emit("leaveRoom", {
        chatroomId,
      });
    };
  }, []);

  return (
    <div className="chatroomPage">
      <div className="chatroomSection">
        <div className="cardHeader">Chatroom Name</div>
        <div className="chatroomContent">
          {messages.map((messageObj, i) => (
            <div key={i} className="message">
              <span
                className={
                  userId === messageObj.userId ? "ownMessage" : "otherMessage"
                }
              >
                {messageObj.name}
              </span>{" "}
              {messageObj.message}
            </div>
          ))}
        </div>
        <div className="chatroomActions">
          <div>
            <input
              ref={messageRef}
              type="text"
              name="message"
              placeholder="Say something!"
            />
          </div>
          <div>
            <button className="join" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatroomPage;
