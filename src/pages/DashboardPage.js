import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function DashboardPage() {
  const [chatrooms, setChatrooms] = useState([]);

  const getChatrooms = useCallback(async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/chatroom", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setChatrooms(data);
    } catch (err) {
      setTimeout(getChatrooms, 3000);
      console.log(err);
    }
  }, []);

  useEffect(() => {
    getChatrooms();
  }, [getChatrooms]);

  return (
    <div className="card">
      <div className="cardHeader">Chatrooms</div>
      <div className="cardBody">
        <div className="inputGroup">
          <label htmlFor="chatroomName">Chatroom Name</label>
          <input
            type="text"
            name="chatroomName"
            id="chatroomName"
            placeholder="My room"
          />
        </div>
        <button>Create Chatroom</button>
      </div>
      <div className="chatrooms">
        {chatrooms.map(chatroom => (
          <div key={chatroom._id} className="chatroom">
            <div>{chatroom.name}</div>
            <Link to={`/chatroom/${chatroom._id}`}>
              <div className="join">Join</div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;
