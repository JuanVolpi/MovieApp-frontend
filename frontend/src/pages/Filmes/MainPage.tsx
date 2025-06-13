import { useState } from "react";
import {Button} from "@heroui/button";


import Navbar from "@/components/navbar";
import { getFilmes } from "@/services/filmesService";

import type { Filme } from "@/types";
import SearchBox from "@/components/input/SearchBox";
import MovieGrid from "@/components/grid/MovieGrid";

const MainPage = () => {
  const [query, setQuery] = useState("");
  const [filmes, setFilmes] = useState<Filme[]>([]);

  const handleSearch = async (texto: string) => {
    setQuery(texto);
    try {
      const resultados = await getFilmes(texto);
      setFilmes(resultados);
    } catch (err) {
      console.error("Erro ao buscar filmes:", err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-xl w-full mx-auto mt-6 px-4">
      <SearchBox
        value={query}
        onChange={(value: string) => handleSearch(value)}
        onClear={() => {
          setQuery("");
          setFilmes([]); 
        }}
      />
      </div>
      <MovieGrid filmes={filmes} onFilmeClick={function (filme: Filme): void {
        throw new Error("Function not implemented.");
      } } />
    </>
  );
};

export default MainPage;
