export const savePreset = async (preset, user) => {
  const URL = process.env.REACT_APP_API_URI;
  const url = `${URL}:5443/users/${user}/savePreset`;
  const idToken = localStorage.getItem("idToken");

  const headers = { "Content-Type": "application/json" };
  if (idToken) {
    headers["Authorization"] = `Bearer ${idToken}`;
  }

  try {
    console.log(preset);
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(preset),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to save creature preset to server: ${errorText}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error posting simulation parameters:", error);
  }
};
