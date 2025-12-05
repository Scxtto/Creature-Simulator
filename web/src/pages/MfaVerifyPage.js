import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./MfaPage.css";

const MfaVerifyPage = ({ onLogin }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [mfaCode, setMfaCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Extract session and email from login redirect
  const { session, email } = location.state || {}; // session is needed for MFA verification

  const handleMfaSubmit = async () => {
    if (!session) {
      setErrorMessage("Invalid session. Please log in again.");
      return;
    }

    console.log("email is", email);
    try {
      const URI = process.env.REACT_APP_API_URI;

      const response = await fetch(`${URI}:5443/mfa/authenticate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ session, mfaCode, email }), // Send session and MFA code for verification
      });

      const data = await response.json();
      if (response.ok) {
        console.log("MFA verification successful:", data);
        const { accessToken, idToken } = data;
        onLogin(email, data.isAdmin);
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("idToken", idToken);
        navigate("/"); // Redirect to home
      } else {
        setErrorMessage("Failed to verify MFA code.");
      }
    } catch (error) {
      setErrorMessage("An error occurred during MFA verification.");
    }
  };

  return (
    <div className="mfa-verify-page">
      <div className="mfa-verify-form">
        <h1>Enter MFA Code</h1>
        <input
          type="text"
          placeholder="Enter MFA Code"
          value={mfaCode}
          onChange={(e) => setMfaCode(e.target.value)}
        />
        <button onClick={handleMfaSubmit}>Verify MFA</button>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </div>
    </div>
  );
};

export default MfaVerifyPage;
