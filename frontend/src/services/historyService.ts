import axios from 'axios'

const BASE_URL = import.meta.env.VITE_HISTORICO_API_BASE_URL

export async function getWatchedMovies(userId: number) {
  const response = await axios.get(
    `${BASE_URL}users/${userId}/entries?state=WATCHED`
  )
  return response.data
}