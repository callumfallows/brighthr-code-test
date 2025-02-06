import { FileData } from "@/types";
import { useRouter } from "next/router";

export function Folder({ folder }: { folder: FileData }) {
  const { push } = useRouter();
  return (
    <div
      className="cursor-pointer"
      onClick={() => {
        push(`/${folder.slug}`);
      }}>
      <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 items-center border-b-2 border-gray-100 py-2">
        📁
        <div data-testid="folder-name" className="min-w-[2rem] truncate">
          {folder.name}
        </div>
        <div className="min-w-[8rem] text-right">{folder.added}</div>
      </div>
    </div>
  );
}
