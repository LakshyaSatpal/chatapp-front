import React, { useRef } from "react";
import axios from "axios";
import makeToast from "../Toaster";
import { useNavigate } from "react-router-dom";

function LoginPage(props) {
  const navigate = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();

  const loginHandler = async () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    try {
      const response = await axios.post("http://localhost:5000/user/login", {
        email,
        password,
      });
      const token = response.data.token;
      localStorage.setItem("token", token);
      makeToast("success", response.data.message);
      props.setupSocket();
      navigate("/dashboard");
    } catch (e) {
      console.log(e);
      makeToast("error", e.response.data.message);
    }
  };

  return (
    <div className="card">
      <div className="cardHeader">Login</div>
      <div className="cardBody">
        <div className="inputGroup">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="abc@example.com"
            ref={emailRef}
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Your password"
            ref={passwordRef}
          />
        </div>
        <button onClick={loginHandler}>Login</button>
      </div>
    </div>
  );
}

export default LoginPage;
