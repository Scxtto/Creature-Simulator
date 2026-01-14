export const postSimParams = async (simulationParams) => {
  try {
    console.log(simulationParams);
    const token = localStorage.getItem("token");
    const headers = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const URL = process.env.REACT_APP_API_URI;
    const response = await fetch(`${URL}:5443/simulate`, {
      method: "POST",
      headers,
      body: JSON.stringify(simulationParams),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to send simulation parameters to server: ${errorText}`);
    }

    return response;
  } catch (error) {
    console.error("Error posting simulation parameters:", error);
  }
};
