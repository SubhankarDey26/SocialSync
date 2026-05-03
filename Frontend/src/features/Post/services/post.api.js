import axios from "axios";

const api = axios.create({
  baseURL: "/api/posts",
  withCredentials: true,
});

export async function getFeed() {
  const response = await api.get("/feed");
  return response.data;
}

export async function likePost(postId) {
  const response = await api.post(`/like/${postId}`);
  return response.data;
}

export async function createPost(formData) {
  const response = await api.post("/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}