import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

// Header Component
// Renders the navigation header with conditional links and buttons based on authentication status
const Header = ({ isAuthenticated, isAdmin, onLogout }) => {
  return (
    <header className="header">
      <nav className="nav-container">
        <div className="nav-right">
          {/* Conditional rendering based on authentication status */}
          {isAuthenticated && (
            <>
              {/* If the user is an admin, show the Settings link, otherwise show History */}
              {isAdmin ? (
                <Link to="/settings" className="header-button">
                  Settings
                </Link>
              ) : (
                <Link to="/" className="header-button">
                  History
                </Link>
              )}
              {/* Logout button */}
              <button onClick={onLogout} className="header-button">
                Logout
              </button>
            </>
          )}
          {!isAuthenticated && (
            <>
              {/* Links for Login and Register if the user is not authenticated */}
              <Link to="/login" className="header-button">
                Login
              </Link>
              <Link to="/register" className="header-button">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
