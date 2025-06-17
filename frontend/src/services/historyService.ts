import axios from 'axios'

const BASE_URL = import.meta.env.VITE_HISTORICO_API_BASE_URL || ''

// 1. Buscar todos os filmes vistos por um utilizador
export async function getWatchedMovies(userId: number) {
  const response = await axios.get(`${BASE_URL}users/${userId}/entries?watched=true`)
  return response.data
}

// 2. Buscar todos os filmes na watchlist
export async function getWatchlist(userId: number) {
  const response = await axios.get(`${BASE_URL}users/${userId}/entries?list=true`)
  return response.data
}

// 3. Buscar entrada específica
export async function getMovieEntry(userId: number, movieId: number) {
  const response = await axios.get(`${BASE_URL}users/${userId}/entries/${movieId}`)
  return response.data
}

// 4. Adicionar à watchlist
export async function addToWatchlist(userId: number, movieId: number) {
  return axios.post(`${BASE_URL}entries`, {
    user_id: userId,
    movie_id: movieId,
    list: true,
  })
}

// 5. Marcar como visto com review
export async function submitReview(
  userId: number,
  movieId: number,
  rating: number,
  reviewText?: string
) {
  return axios.post(`${BASE_URL}entries`, {
    user_id: userId,
    movie_id: movieId,
    list: true,
    watched: true,
    rating,
    watch_date: new Date().toISOString().split('T')[0],
    review_text: reviewText || null
  })
}

// 6. Marcar como assistido sem review
export async function markAsWatched(userId: number, movieId: number, rating: number) {
  return axios.post(`${BASE_URL}entries`, {
    user_id: userId,
    movie_id: movieId,
    list: true,
    watched: true,
    rating,
    watch_date: new Date().toISOString().split('T')[0]
  })
}

// 7. Remover entrada
export async function removeEntry(userId: number, movieId: number) {
  return axios.delete(`${BASE_URL}entries`, {
    data: { user_id: userId, movie_id: movieId }
  })
}
