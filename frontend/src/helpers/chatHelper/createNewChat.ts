import axios from "axios";

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
const chatURL = `${backendURL}/chat`;

interface CreateNewChatProps {
  token: string;
}

export async function createNewChat({ token }: CreateNewChatProps) {
  try {
    const response = await axios.post(
      chatURL,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log("Error in create chat section", error);
  }
}
