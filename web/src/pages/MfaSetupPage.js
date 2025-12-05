import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./MfaPage.css";

const MfaSetupPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [qrCodeImageUrl, setQrCodeImageUrl] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [sesh, setSesh] = useState("");

  // Extract session and email from state (passed from the login page)
  let { session, email } = location.state || {};

  // Function to initiate MFA setup and retrieve QR code
  const getQRCode = async () => {
    const URI = process.env.REACT_APP_API_URI;
    if (!session) {
      setErrorMessage("Invalid session. Please log in again.");
      return;
    }

    try {
      const response = await fetch(`${URI}:5443/mfa/setup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ session }), // Use session for MFA setup
      });

      const data = await response.json();
      if (response.ok) {
        // Set the QR code image URL and store the updated session
        setSesh(data.session);
        setQrCodeImageUrl(data.qrCodeImageUrl);
      } else {
        setErrorMessage("Failed to initiate MFA setup.");
      }
    } catch (error) {
      setErrorMessage("An error occurred during MFA setup.");
    }
  };

  // Function to submit the MFA code and verify it
  const handleMfaSubmit = async () => {
    const URI = process.env.REACT_APP_API_URI;
    try {
      const response = await fetch(`${URI}:5443/mfa/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ session: sesh, mfaCode }), // Send session and MFA code for verification
      });

      const data = await response.json();
      if (response.ok) {
        console.log("MFA verification successful:", data);
        navigate("/login"); // Redirect to login after successful MFA setup
      } else {
        setErrorMessage("Failed to verify MFA code.");
      }
    } catch (error) {
      setErrorMessage("An error occurred during MFA verification.");
    }
  };

  return (
    <div className="mfa-setup-page">
      <div className="mfa-setup-form">
        <h1>Set Up MFA</h1>

        {qrCodeImageUrl ? (
          <>
            <p>Scan this QR code with your authenticator app:</p>
            <img src={qrCodeImageUrl} alt="QR Code" /> {/* Display the QR code */}
            <input
              type="text"
              placeholder="Enter MFA Code"
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value)}
            />
            <button onClick={handleMfaSubmit}>Verify MFA</button>
          </>
        ) : (
          <>
            <button onClick={getQRCode}>Get QR Code</button>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default MfaSetupPage;
