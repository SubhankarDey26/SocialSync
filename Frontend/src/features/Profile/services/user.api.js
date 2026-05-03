import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});


// const api = axios.create({
//     baseURL: "/api/users",
//     withCredentials: true
// });

// export async function followUser(username) {
//   const response = await api.post(`/follow/${username}`);
//   return response.data;
// }

export async function followUser(username) {
  const res = await api.post(`/users/follow/${username}`);
  return res.data;
}

// export async function unfollowUser(username) {
//   const response = await api.post(`/unfollow/${username}`);
//   return response.data;
// }


export async function unfollowUser(username) {
  const res = await api.post(`/users/unfollow/${username}`);
  return res.data;
}

export async function getFollowRequests() {
  const response = await api.get("/users/follow-requests");
  return response.data;
}

export async function acceptFollowRequest(requestId) {
  const response = await api.post(`/users/follow-requests/${requestId}/accept`);
  return response.data;
}

export async function rejectFollowRequest(requestId) {
  const response = await api.post(`/users/follow-requests/${requestId}/reject`);
  return response.data;
}

export async function getFollowers() {
  const response = await api.get("/users/followers");
  return response.data;
}

export async function getFollowing() {
  const response = await api.get("/users/following");
  return response.data;
}