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

      if (result && result.userSub) {
        navigate("/login");
      } else {
        setErrorMessage("Registration failed: Missing userSub in the response.");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setErrorMessage("An error occurred during registration.");
    }
  };

  // Function to handle Google Sign-Up via Federated Identity Provider (Cognito)
  const handleGoogleSignUp = () => {
    const googleSignupUrl = `https://n11580062-accounts.auth.ap-southeast-2.amazoncognito.com/oauth2/authorize?response_type=code&client_id=3h6ddqv5mt43l04dpn7fsfvbd7&redirect_uri=https://spag-alb.cab432.com/login&identity_provider=Google&scope=email+openid+profile`;
    window.location.href = googleSignupUrl; // Redirect to Google sign-up
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

        <div className="federated-signup">
          <p>Or sign up using:</p>
          <button className="google-signup-btn" onClick={handleGoogleSignUp}>
            Sign Up with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
