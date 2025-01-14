import React, { useState, useRef } from "react";
import "./AuthForm.css";
import { signUp } from "../api/auth";
import { toast } from "react-toastify";

export const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const fullNameRef = useRef(null);
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullName = fullNameRef.current?.value;
    const username = usernameRef.current.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current.value;
    const payload = { fullName, username, email, password };
    try {
      if (isLogin) {
      } else {
        const data = await signUp(payload);
        console.log(data.message);
        toast.success(data.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h1>{isLogin ? "Login" : "Sign Up"}</h1>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Full name</label>
              <input
                type="text"
                id="full-name"
                placeholder="Enter your Full name"
                required
                ref={fullNameRef}
              />
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                required
                ref={emailRef}
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="name">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              required
              ref={usernameRef}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              required
              ref={passwordRef}
            />
          </div>
          <button type="submit" className="btn">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <p>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? " Sign Up" : " Login"}
          </span>
        </p>
      </div>
    </div>
  );
};
