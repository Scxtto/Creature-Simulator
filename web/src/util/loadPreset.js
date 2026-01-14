export const loadPreset = async (user) => {
  const URL = process.env.REACT_APP_API_URI;
  const url = `${URL}:5443/users/${user}/loadPresets`;

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
      console.error(`Failed to load creature presets from server: ${errorText}`);
      return null;
    }

    const presets = await response.json();
    return presets;
  } catch (error) {
    console.error("Error loading creature presets:", error);
    return null;
  }
};
