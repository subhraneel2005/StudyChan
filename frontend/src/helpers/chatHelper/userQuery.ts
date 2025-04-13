import axios from "axios";

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface UserQueryProps {
  chatId: string;
  token: string;
  userQuery: string;
  fileName: string;
}

export async function UserQuery({
  chatId,
  token,
  userQuery,
  fileName,
}: UserQueryProps) {
  const url = `${backendURL}/ask/${chatId}`;

  try {
    const response = await axios.post(
      url,
      {
        userQuery,
        fileName,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error in User Query helper: ", error);
  }
}
