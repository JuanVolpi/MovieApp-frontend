import axios from 'axios'

const BASE_URL = import.meta.env.VITE_HISTORICO_API_BASE_URL || ''

// 1. Buscar todos os filmes vistos por um utilizador
export async function getWatchedMovies(userId: number) {
  const response = await axios.get(`${BASE_URL}users/${userId}/entries?state=true`)
  return response.data
}

// 2. Buscar todos os filmes na watchlist
export async function getWatchlist(userId: number) {
  const response = await axios.get(`${BASE_URL}users/${userId}/entries?state=false`)
  return response.data
}

// 3. Buscar entrada específica (para editar ou exibir detalhes da relação)
export async function getMovieEntry(userId: number, movieId: number) {
  const response = await axios.get(`${BASE_URL}users/${userId}/entries/${movieId}`)
  return response.data
}

// 4. Adicionar à watchlist (state: false)
export async function addToWatchlist(userId: number, movieId: number) {
  return axios.post(`${BASE_URL}entries`, {
    user_id: userId,
    movie_id: movieId,
    state: false
  })
}

// 5. Marcar como visto com review (state: true + rating + watch_date)
export async function submitReview(
  userId: number,
  movieId: number,
  rating: number,
  reviewText?: string
) {
  return axios.post(`${BASE_URL}entries`, {
    user_id: userId,
    movie_id: movieId,
    state: true,
    rating,
    watch_date: new Date().toISOString().split('T')[0],
    review_text: reviewText || null
  })
}

// 6. Atualizar um filme da watchlist para visto (sem texto de review)
export async function markAsWatched(userId: number, movieId: number, rating: number) {
  return axios.post(`${BASE_URL}entries`, {
    user_id: userId,
    movie_id: movieId,
    state: true,
    rating,
    watch_date: new Date().toISOString().split('T')[0]
  })
}

// 7. Remover entrada (de watchlist ou vistos)
export async function removeEntry(userId: number, movieId: number) {
  return axios.delete(`${BASE_URL}entries`, {
    data: { user_id: userId, movie_id: movieId }
  })
}
