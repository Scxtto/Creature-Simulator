import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginPost } from "../util/loginPost";
import "./LoginPage.css";

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authorizationCode = params.get("code");

    const currentDomain = window.location.hostname;
    const URI = process.env.REACT_APP_API_URI;
    if (currentDomain.includes("spag-alb")) {
      window.location.href = `${URI}:3000/login?code=${authorizationCode}`;
      return;
    }

    if (authorizationCode && !currentDomain.includes("spag-alb")) {
      console.log(authorizationCode);
      // If the authorization code exists, exchange it for tokens
      exchangeCodeForTokens(authorizationCode);
    }
  }, []);

  const exchangeCodeForTokens = async (authorizationCode) => {
    const URI = process.env.REACT_APP_API_URI;
    const redirectUri = `https://spag-alb.cab432.com/login`;

    const body = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: "3h6ddqv5mt43l04dpn7fsfvbd7",
      code: authorizationCode,
      redirect_uri: redirectUri,
    });

    try {
      const response = await fetch(
        "https://n11580062-accounts.auth.ap-southeast-2.amazoncognito.com/oauth2/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: body.toString(),
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log("Token response:", data);
        const { access_token, id_token } = data;

        // Store the tokens and navigate to the desired page
        localStorage.setItem("accessToken", access_token);
        localStorage.setItem("idToken", id_token);

        const currentDomain = window.location.hostname;
        if (currentDomain.includes("spag-alb")) {
          window.location.href = `${URI}:3000/login?code={authorizationCode}`;
          return;
        }

        // Fetch the email address from the API using the id_token
        const emailResponse = await fetch(`${URI}:5443/token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${id_token}`,
          },
        });

        const emailData = await emailResponse.json();
        if (emailResponse.ok && emailData.email) {
          const email = emailData.email;
          console.log("Email is", email);
          onLogin(email, false);
          navigate("/");
        } else {
          console.error("Failed to fetch email:", emailData);
          setErrorMessage("Failed to retrieve email address from token.");
        }
      } else {
        console.error("Failed to exchange code:", data);
        setErrorMessage("Failed to exchange authorization code for tokens.");
      }
    } catch (error) {
      console.error("Error exchanging authorization code:", error);
      setErrorMessage("An error occurred while exchanging the authorization code.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const result = await loginPost(email, password);

    console.log(result);

    if (result) {
      const { isAdmin, ChallengeName, Session } = result; // Extract MFA-related data

      if (ChallengeName === "MFA_SETUP") {
        // Redirect to the MFA setup page with session
        navigate("/mfa/setup", { state: { session: Session, email } });
      } else if (ChallengeName === "SOFTWARE_TOKEN_MFA" || ChallengeName === "SMS_MFA") {
        // Redirect to the MFA verification page with session
        navigate("/mfa/verify", { state: { session: Session, email } });
      } else {
        console.error("Unexpected login response");
      }
    } else {
      console.error("Login failed.");
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
