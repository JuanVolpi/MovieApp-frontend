import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { Input } from "@heroui/react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
}

export default function SearchBox({ value, onChange, onClear }: Props) {
  return (
    <Input
      isClearable
      value={value}
      onValueChange={onChange}
      onClear={onClear}
      placeholder="Search for movies..."
      radius="lg"
      classNames={{
        label: "text-black/50 dark:text-white/90",
        input: [
          "bg-transparent",
          "text-black dark:text-white",
          "placeholder:text-gray-400 dark:placeholder:text-gray-500",
        ],
        innerWrapper: "bg-transparent",
        inputWrapper: [
          "shadow-md",
          "bg-gray-100 dark:bg-gray-800",
          "hover:bg-gray-200 dark:hover:bg-gray-700",
          "group-data-[focus=true]:bg-gray-100 dark:group-data-[focus=true]:bg-gray-800",
        ],
      }}
      startContent={
        <MagnifyingGlassIcon className="text-default-400 dark:text-white w-5 h-5" />
      }
    />
  );
}
