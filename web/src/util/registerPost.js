export const registerPost = async (email, password) => {
  try {
    const URL = process.env.REACT_APP_API_URI;
    const response = await fetch(`${URL}:5443/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log("response:");
    console.log(response);
    if (response.ok) {
      console.log("User registered successfully:", data);
      return data;
    }

    console.error("Error registering user:", data.message);
    return null;
  } catch (error) {
    console.error("Error during registration:", error);
    return null;
  }
};
