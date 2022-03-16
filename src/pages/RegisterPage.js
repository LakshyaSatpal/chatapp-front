import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import makeToast from "../Toaster.js";
import axios from "axios";

function RegisterPage() {
  const navigate = useNavigate();
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const registerHandler = async () => {
    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    try {
      const res = await axios.post("http://localhost:5000/user/register", {
        name,
        email,
        password,
      });
      makeToast("success", res.data.message);
      navigate("/login");
    } catch (e) {
      console.log(e);
      makeToast("error", e.response.data.message);
    }
  };
  return (
    <div className="card">
      <div className="cardHeader">Register</div>
      <div className="cardBody">
        <div className="inputGroup">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="John Doe"
            ref={nameRef}
          />
        </div>
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
        <button onClick={registerHandler}>Register</button>
      </div>
    </div>
  );
}

export default RegisterPage;
