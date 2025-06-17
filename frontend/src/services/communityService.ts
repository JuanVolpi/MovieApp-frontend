import axios from "axios";

const BASE_URL = import.meta.env.VITE_UTILIZADOR_API_BASE_URL;

// Buscar utilizador por username
export async function getUserByUsername(username: string) {
  const response = await axios.get(`${BASE_URL}username/${username}`);
  return response.data;
}

// Buscar utilizador por username pesquisa parcial
export async function getUsersByPartialUsername(username: string) {
  const response = await axios.get(`${BASE_URL}search`, {
    params: { query: username }
  });
  return response.data;
}

// Buscar utilizador por ID
export async function getUserById(id: number) {
  const response = await axios.get(`${BASE_URL}${id}`);
  return response.data;
}

export async function followUser(_myId: number, userToFollowId: number, token: string) {
  return axios.post(
    `${BASE_URL}${userToFollowId}/follow`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
}


export async function unfollowUser(_myId: number, userToUnfollowId: number, token: string) {
  return axios.post(
    `${BASE_URL}${userToUnfollowId}/unfollow`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
}

// Buscar seguidores do utilizador
export async function getFollowers(id: number) {
  const response = await axios.get(`${BASE_URL}${id}/followers`);
  return response.data; // array de utilizadores
}

// Buscar quem o utilizador segue
export async function getFollowing(id: number) {
  const response = await axios.get(`${BASE_URL}${id}/following`);
  return response.data; // array de utilizadores
}
