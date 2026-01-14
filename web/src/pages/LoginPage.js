import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginPost } from "../util/loginPost";
import "./LoginPage.css";

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const result = await loginPost(email, password);

    console.log(result);

    if (result) {
      const { isAdmin, token } = result;

      if (token) {
        localStorage.setItem("token", token);
        onLogin(email, isAdmin);
        navigate("/");
      } else {
        console.error("Login response missing token.");
        setErrorMessage("Login failed.");
      }
    } else {
      console.error("Login failed.");
      setErrorMessage("Login failed.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-form">
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
