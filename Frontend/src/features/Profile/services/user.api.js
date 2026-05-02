import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:3000/api/users",
//   withCredentials: true,
// });


const api = axios.create({
    baseURL: "/api/users",
    withCredentials: true
});

// export async function followUser(username) {
//   const response = await api.post(`/follow/${username}`);
//   return response.data;
// }

export async function followUser(username) {
  const res = await api.post(`/follow/${username}`);
  return res.data;
}

// export async function unfollowUser(username) {
//   const response = await api.post(`/unfollow/${username}`);
//   return response.data;
// }


export async function unfollowUser(username) {
  const res = await api.post(`/unfollow/${username}`);
  return res.data;
}

export async function getFollowRequests() {
  const response = await api.get("/follow-requests");
  return response.data;
}

export async function acceptFollowRequest(requestId) {
  const response = await api.post(`/follow-requests/${requestId}/accept`);
  return response.data;
}

export async function rejectFollowRequest(requestId) {
  const response = await api.post(`/follow-requests/${requestId}/reject`);
  return response.data;
}

export async function getFollowers() {
  const response = await api.get("/followers");
  return response.data;
}

export async function getFollowing() {
  const response = await api.get("/following");
  return response.data;
}