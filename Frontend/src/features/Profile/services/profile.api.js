import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// const api = axios.create({
//     baseURL: "/api/users",
//     withCredentials: true
// });

export async function updateProfile(data) {
  if (data instanceof FormData) {
    const response = await api.put("/users/profile", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  const response = await api.put("/users/profile", data);
  return response.data;
}