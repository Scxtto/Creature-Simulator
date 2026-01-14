import React, { useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ResultsPage from "./pages/ResultsPage";
import LoginPage from "./pages/LoginPage";
import Header from "./pages/Header";
import SettingsPage from "./pages/SettingsPage";
import RegisterPage from "./pages/RegisterPage";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false); // Track if the user is an admin

  const handleLogin = async (email, adminStatus) => {
    setUserEmail(email);
    setIsAdmin(adminStatus); // Set the admin status during login
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserEmail("");
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("idToken");
    setIsAdmin(false); // Reset the admin status on logout
  };

  return (
    <>
      <Header isAuthenticated={isAuthenticated} isAdmin={isAdmin} onLogout={handleLogout} />
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <HomePage email={userEmail} /> : <Navigate to="/login" />}
        />
        <Route path="/results" element={isAuthenticated ? <ResultsPage /> : <Navigate to="/login" />} />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />}
        />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <RegisterPage />} />
        <Route path="/settings" element={isAdmin ? <SettingsPage /> : <Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;
