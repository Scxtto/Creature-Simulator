import React, { useState } from "react";
import "./RegisterPage.css";
import { registerPost } from "../util/registerPost";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // To handle error
  const navigate = useNavigate(); // Initialize the navigate hook

  // Function to handle register form submission and call the registerPost utility
  const handleRegister = async (e) => {
    // Prevent the default form submission behavior
    e.preventDefault();

    try {
      const result = await registerPost(email, password);

      if (result && result.email) {
        navigate("/login");
      } else {
        setErrorMessage("Registration failed.");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setErrorMessage("An error occurred during registration.");
    }
  };

  return (
    <div className="register-page">
      <div className="register-form">
        <h1>Register</h1>
        <form onSubmit={handleRegister}>
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
          <button type="submit">Register</button>
        </form>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      </div>
    </div>
  );
};

export default RegisterPage;
