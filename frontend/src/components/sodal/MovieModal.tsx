import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Image } from "@heroui/react";
import { Filme } from "@/types";
import { XMarkIcon } from "@heroicons/react/24/solid";

interface MovieModalProps {
  filme: Filme;
  onClose: () => void;
}

export default function MovieModal({ filme, onClose }: MovieModalProps) {
  return (
    <Modal isOpen={true} onClose={onClose} backdrop="blur" className="z-[1000]">
      <ModalContent className="max-w-4xl">
        <ModalHeader className="flex justify-between items-center">
          <h2 className="text-xl font-bold">{filme.title}</h2>
        </ModalHeader>

        <ModalBody className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Image
            src={`https://image.tmdb.org/t/p/w500${filme.poster_path}`}
            alt={filme.title}
            radius="lg"
            className="w-full h-auto object-cover"
          />

          <div className="md:col-span-2 flex flex-col gap-4">
            <p><span className="font-semibold">Título original:</span> {filme.original_title}</p>
            <p><span className="font-semibold">Idioma original:</span> {filme.original_language.toUpperCase()}</p>
            <p><span className="font-semibold">Data de lançamento:</span> {filme.release_date}</p>
            <p><span className="font-semibold">Nota:</span> {filme.vote_average.toFixed(1)} / 10</p>
            <p><span className="font-semibold">Descrição:</span> {filme.overview || "Sem descrição disponível."}</p>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant="flat" color="secondary" onPress={onClose}>
            Fechar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
