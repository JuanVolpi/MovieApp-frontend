import axios from "axios";

const BASE_URL = "http://localhost:5001";

export async function getUserByUsername(username: string) {
  const response = await axios.get(`${BASE_URL}/users/username/${username}`);
  return response.data; // espera-se: { id, username, ... }
}

export async function followUser(myId: number, userToFollowId: number) {
  return axios.post(`${BASE_URL}/users/${myId}/follow`, {
    user_to_follow_id: userToFollowId,
  });
}

export async function unfollowUser(myId: number, userToUnfollowId: number) {
  return axios.post(`${BASE_URL}/users/${myId}/unfollow`, {
    user_to_unfollow_id: userToUnfollowId,
  });
}
