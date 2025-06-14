import { useState } from "react";
import Navbar from "@/components/navbar";
import { getFilmes } from "@/services/filmesService";
import type { Filme } from "@/types";
import SearchBox from "@/components/input/SearchBox";
import MovieGrid from "@/components/grid/MovieGrid";
import MovieModal from "@/components/sodal/MovieModal";

const MainPage = () => {
  const [query, setQuery] = useState("");
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [filmeSelecionado, setFilmeSelecionado] = useState<Filme | null>(null);

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
        placeholder="Pesquise por filmes"
        onChange={(value: string) => handleSearch(value)}
        onClear={() => {
          setQuery("");
          setFilmes([]); 
        }}
      />
      </div>
      <MovieGrid filmes={filmes}  onFilmeClick={(filme) => setFilmeSelecionado(filme)} />

      {filmeSelecionado && (
        <MovieModal
          filme={filmeSelecionado}
          onClose={() => setFilmeSelecionado(null)}
        />
      )}
    </>
  );
};

export default MainPage;
