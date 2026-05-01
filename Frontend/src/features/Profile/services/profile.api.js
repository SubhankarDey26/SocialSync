import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/users",
  withCredentials: true,
});

export async function updateProfile(data) {
  if (data instanceof FormData) {
    const response = await api.put("/profile", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  const response = await api.put("/profile", data);
  return response.data;
}