// src/services/filmesService.ts
import axios from "axios";
import type { Filme } from "@/types";

const BASE_URL = import.meta.env.VITE_FILMES_API_BASE_URL;

export async function getFilmes(query: string): Promise<Filme[]> {
  const response = await axios.get(`${BASE_URL}movies/search`, {
    params: { query },
  });
  return response.data ?? [];
}

export async function getPopular(): Promise<Filme[]> {
  const response = await axios.get(`${BASE_URL}movies/popular`, {
  });
  console.log("Popular response:", response.data);
  return response.data ?? [];
}
