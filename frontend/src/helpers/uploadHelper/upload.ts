import axios from "axios";

interface UploadTypes {
  file: File;
  token: string;
}

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const uploadFile = async ({ file, token }: UploadTypes) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(`${backendURL}/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log("Error in uplodHelper", error);
    throw error;
  }
};
