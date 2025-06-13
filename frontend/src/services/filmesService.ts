// src/services/filmesService.ts
import axios from "axios";
import type { Filme } from "@/types";

export async function getFilmes(query: string): Promise<Filme[]> {
  const response = await axios.get("http://localhost:5002/api/movies/search", {
    params: { query },
  });
  return response.data ?? [];
}