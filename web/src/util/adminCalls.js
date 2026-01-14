// Function to get all history
export const getHistory = async () => {
  const URL = process.env.REACT_APP_API_URI;
  const url = `${URL}:5443/admin/getHistory`;

  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to get history: ${errorText}`);
      return null;
    }

    const history = await response.json();
    return history;
  } catch (error) {
    console.error("Error fetching history:", error);
    return null;
  }
};

// Function to add a new account
export const addAccount = async (email, password) => {
  const URL = process.env.REACT_APP_API_URI;
  const url = `${URL}:5443/admin/addAccount`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to add account: ${errorText}`);
      return null;
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error adding account:", error);
    return null;
  }
};

// Function to update an account's password
export const updateAccount = async (email, newPassword) => {
  const URL = process.env.REACT_APP_API_URI;
  const url = `${URL}:5443/admin/updateAccount`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to update account: ${errorText}`);
      return null;
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error updating account:", error);
    return null;
  }
};

// Function to delete an account
export const deleteAccount = async (email) => {
  const URL = process.env.REACT_APP_API_URI;
  const url = `${URL}:5443/admin/deleteAccount`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to delete account: ${errorText}`);
      return null;
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error deleting account:", error);
    return null;
  }
};
