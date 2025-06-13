import { Card, CardBody, Image } from "@heroui/react";
import { BeakerIcon } from "@heroicons/react/24/outline";
import type { Filme } from "@/types";

interface MovieCardProps {
  filme?: Filme; // agora opcional para prevenir crashes
  onClick?: () => void;
  estaNaLista?: boolean;
  nota?: number;
}

export default function MovieCard({
  filme,
  onClick = () => {},
  estaNaLista,
  nota,
}: MovieCardProps) {
  if (!filme) return null; // fallback seguro

  const posterUrl = filme.poster_path
    ? `https://image.tmdb.org/t/p/w500${filme.poster_path}`
    : "https://via.placeholder.com/200x300?text=Sem+Imagem"; // imagem fallback

  return (
    <Card
      isPressable
      onPress={onClick}
      className="w-full max-w-[200px] transition-transform hover:scale-105 shadow-lg"
    >
      <CardBody className="p-0 relative">
        <Image
          src={posterUrl}
          alt={filme.title ?? "Filme sem título"}
          className="w-full h-[300px] object-cover rounded"
        />

        {nota !== undefined && (
          <div className="absolute top-2 left-2 bg-yellow-600 text-white text-sm px-2 py-1 rounded flex items-center gap-1">
            {nota}
            <BeakerIcon className="size-6 text-blue-500" />
          </div>
        )}

        {estaNaLista && (
          <div className="absolute top-2 right-2 text-pink-500 text-xl">
            ♥
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 text-center">
          {filme.title ?? "Título indisponível"}
        </div>
      </CardBody>
    </Card>
  );
}
