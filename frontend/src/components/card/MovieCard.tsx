import { Card, CardBody, Image } from "@heroui/react";
import type { Filme } from "@/types";
import { BeakerIcon } from "@heroicons/react/24/outline";

interface MovieCardProps {
  filme: Filme;
  onClick: () => void;
  estaNaLista?: boolean;
  nota?: number;
}

export default function MovieCard({
  filme,
  onClick,
  estaNaLista,
  nota,
}: MovieCardProps) {
  return (
    <Card
      isPressable
      onPress={onClick}
      className="w-full max-w-[200px] transition-transform hover:scale-105 shadow-lg overflow-hidden relative"
    >
      <CardBody className="p-0">
        <Image
          src={
            filme.poster_path
              ? `https://image.tmdb.org/t/p/w500${filme.poster_path}`
              : "https://via.placeholder.com/200x300?text=Sem+Imagem"
          }
          alt={filme.title || "Sem título"}
          className="w-full h-[300px] object-cover"
        />

        {nota !== undefined && (
          <div className="absolute top-2 left-2 bg-yellow-600 text-white text-sm px-2 py-1 rounded flex items-center gap-1 z-10">
            {nota}
            <BeakerIcon className="size-4 text-white" />
          </div>
        )}

        {estaNaLista && (
          <div className="absolute top-2 right-2 text-pink-500 text-xl z-10">
            ♥
          </div>
        )}

        {/* Título do filme fixado no fundo */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 text-center z-10">
          {filme.title || "Título indisponível"}
        </div>
      </CardBody>
    </Card>
  );
}
