import axios from "axios";

interface SignupData {
  username: string;
  email: string;
  password: string;
}

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const signup = async (data: SignupData) => {
  const URL = `${backendURL}/signup`;
  try {
    console.log("Using URL:", URL);

    const response = await axios.post(URL, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error in signup helper file:", error);
  }
};
