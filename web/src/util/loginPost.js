export const loginPost = async (email, password) => {
  const URL = process.env.REACT_APP_API_URI;
  const url = `${URL}:5443/login`;

  try {
    console.log(`Logging in as ${email}...`);
    console.log(`URL: ${url}`);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to log in: ${errorText}`);
      return null;
    }

    // Parse the response
    const data = await response.json();
    console.log("Login response data:", data);

    // Handle MFA setup or verification challenges
    if (data.ChallengeName) {
      console.log(`MFA challenge required: ${data.ChallengeName}`);

      return {
        ChallengeName: data.ChallengeName,
        ChallengeParameters: data.ChallengeParameters,
        Session: data.Session,
        AccessToken: data.AccessToken,
      };
    }

    return null;
  } catch (error) {
    console.error("Error posting login data:", error);
    return null;
  }
};
