import React, { useState } from "react";
import "./SettingsPage.css";
import { getHistory, addAccount, updateAccount, deleteAccount } from "../util/adminCalls";

const SettingsPage = () => {
  // State for account management
  const [accountName, setAccountName] = useState("");
  const [accountPassword, setAccountPassword] = useState("");
  const [updateAccountName, setUpdateAccountName] = useState("");
  const [updateAccountPassword, setUpdateAccountPassword] = useState("");
  const [deleteAccountName, setDeleteAccountName] = useState("");
  const [showPopup, setShowPopup] = useState(false); // State to manage popup visibility
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [history, setHistory] = useState([]); // State to store history records

  const recordsPerPage = 10; // Number of accounts to show per page

  // Logic for displaying current accounts based on the page
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentHistory = history.slice(indexOfFirstRecord, indexOfLastRecord);

  const [sortOrder, setSortOrder] = useState("asc"); // Default sort order
  const [sortField, setSortField] = useState(null);

  // Logic for changing pages
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Function to sort accounts based on a field and order (asc/desc)
  const sortHistory = (field) => {
    const sortedHistory = [...history].sort((a, b) => {
      if (a[field] < b[field]) return sortOrder === "asc" ? -1 : 1;
      if (a[field] > b[field]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setHistory(sortedHistory); // Update the history state with the sorted data
    setSortOrder(sortOrder === "asc" ? "desc" : "asc"); // Toggle sort order
    setSortField(field); // Set the field currently being sorted
    setCurrentPage(1); // Reset to the first page
  };

  // Function to handle adding an account
  const handleAddAccount = async () => {
    try {
      const result = await addAccount(accountName, accountPassword);
      if (result) {
        console.log("Add Account clicked:", accountName);
      }
    } catch (error) {
      console.error("Failed to add account:", error);
    } finally {
      setAccountName("");
      setAccountPassword("");
    }
  };

  // Function to handle updating an account
  const handleUpdateAccount = async () => {
    try {
      const result = await updateAccount(updateAccountName, updateAccountPassword);
      if (result) {
        console.log("Update Account clicked:", updateAccountName);
      }
    } catch (error) {
      console.error("Failed to update account:", error);
    } finally {
      setUpdateAccountName("");
      setUpdateAccountPassword("");
    }
  };

  // Function to handle deleting an account
  const handleDeleteAccount = async () => {
    try {
      const result = await deleteAccount(deleteAccountName);
      if (result) {
        console.log("Delete Account clicked:", deleteAccountName);
      }
    } catch (error) {
      console.error("Failed to delete account:", error);
    } finally {
      setDeleteAccountName("");
    }
  };

  // Function to handle getting all accounts
  const handleGetHistory = async () => {
    try {
      const res = await getHistory(); // Call the API to get history
      console.log(res);
      if (Array.isArray(res)) {
        setHistory(res); // Update history only if the response is an array
      } else {
        setHistory([]); // Set history to an empty array if the response is not valid
      }
      setCurrentPage(1); // Reset the pagination to the first page
      setShowPopup(true); // Show the popup when history is fetched
    } catch (error) {
      console.error("Failed to fetch history:", error);
    }
  };

  return (
    <div className="settings-container">
      <h1>Account Management</h1>
      <div className="settings-group">
        <input
          type="text"
          placeholder="Enter new account name"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter new password"
          value={accountPassword}
          onChange={(e) => setAccountPassword(e.target.value)}
        />
        <button onClick={handleAddAccount}>Add Account</button>
      </div>
      <div className="settings-group">
        <input
          type="text"
          placeholder="Enter account name to update"
          value={updateAccountName}
          onChange={(e) => setUpdateAccountName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter updated password"
          value={updateAccountPassword}
          onChange={(e) => setUpdateAccountPassword(e.target.value)}
        />
        <button onClick={handleUpdateAccount}>Update Account</button>
      </div>
      <div className="settings-group">
        <input
          type="text"
          placeholder="Enter account name to delete"
          value={deleteAccountName}
          onChange={(e) => setDeleteAccountName(e.target.value)}
        />
        <div />
        <div />
        <button onClick={handleDeleteAccount}>Delete Account</button>
      </div>
      <div className="settings-group">
        <div />
        <div />
        <div />
        <div />
        <button onClick={handleGetHistory}>View History</button>
      </div>
      {showPopup && (
        <div className="popup-settings">
          <div className="popup-inner-settings">
            <h2>Simulation History</h2>

            {/* Table Headers */}
            <div className="history-table-header">
              <span onClick={() => sortHistory("email")}>
                Email {sortField === "email" && (sortOrder === "asc" ? "▲" : "▼")}
              </span>
              <span onClick={() => sortHistory("sim_uuid")}>
                Sim UUID {sortField === "sim_uuid" && (sortOrder === "asc" ? "▲" : "▼")}
              </span>
              <span onClick={() => sortHistory("datetime")}>
                Date {sortField === "datetime" && (sortOrder === "asc" ? "▲" : "▼")}
              </span>
              <span onClick={() => sortHistory("compute_cost")}>
                Compute Cost {sortField === "compute_cost" && (sortOrder === "asc" ? "▲" : "▼")}
              </span>
              <span onClick={() => sortHistory("status")}>
                Status {sortField === "status" && (sortOrder === "asc" ? "▲" : "▼")}
              </span>
              <span onClick={() => sortHistory("node_type")}>
                Node Type {sortField === "node_type" && (sortOrder === "asc" ? "▲" : "▼")}
              </span>
              <span onClick={() => sortHistory("result_size")}>
                Result Size {sortField === "result_size" && (sortOrder === "asc" ? "▲" : "▼")}
              </span>
              <span onClick={() => sortHistory("duration")}>
                Duration {sortField === "duration" && (sortOrder === "asc" ? "▲" : "▼")}
              </span>
              <span>Failure Reason</span>
            </div>

            {/* Table Rows */}
            <div className="history-table-body">
              {currentHistory.map((record, index) => (
                <div key={index} className="history-row">
                  <span>{record.email} </span>
                  <span>{record.sim_uuid} </span>
                  <span>{new Date(record.datetime).toLocaleString()} </span>
                  <span>{record.compute_cost} </span>
                  <span>{record.status} </span>
                  <span>{record.node_type} </span>
                  <span>{record.result_size} </span>
                  <span>{record.duration} </span>
                  <span>{record.failure_reason || "N/A"} </span>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="pagination">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="page-item"
              >
                {"<"}
              </button>
              <div className="pagination-placeholder"></div>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === Math.ceil(history.length / recordsPerPage)}
                className="page-item"
              >
                {">"}
              </button>
            </div>

            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
