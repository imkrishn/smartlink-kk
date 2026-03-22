import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";

type Props = {
  id: string;
  data: { title: string; href: string };
  onEdit: () => void;
  onDelete: () => void;
};

export default function LinkCard({ id, data, onEdit, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={style}
      className="flex items-center border border-[#AAA3A3] p-3 rounded-md bg-white shadow-sm"
    >
      <Image
        {...listeners}
        src="/drag.png"
        width={20}
        height={25}
        alt="Drag Icon"
        className="cursor-grab mr-2"
      />
      <div className="flex-1 px-2 overflow-hidden">
        <p className="font-bold text-[#4E4B4B] truncate">{data.title}</p>
        <p className="text-sm text-[#8D8A8A] truncate">{data.href}</p>
      </div>
      <div className="flex gap-2">
        <a
          href={`${process.env.NEXT_PUBLIC_URL}/dashboard/link_overview/${id}`}
        >
          <Image
            src="/analytics1.png"
            width={20}
            height={20}
            alt="Analytics"
            className="cursor-pointer"
          />
        </a>

        <Image
          onClick={onEdit}
          src="/edit.png"
          width={20}
          height={20}
          alt="Edit"
          className="cursor-pointer"
        />
        <Image
          onClick={onDelete}
          src="/remove.png"
          width={20}
          height={15}
          alt="Remove"
          className="cursor-pointer"
        />
      </div>
    </div>
  );
}
