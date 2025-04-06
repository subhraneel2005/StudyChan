import axios from "axios";

interface SigninData {
  username: string;
  password: string;
}

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const signin = async (data: SigninData) => {
  const URL = `${backendURL}/signin`;
  try {
    console.log("Using URL:", URL);

    const response = await axios.post(URL, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error in signin helper file:", error);
  }
};
