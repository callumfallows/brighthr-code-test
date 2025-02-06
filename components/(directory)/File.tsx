import { FileData } from "@/types";

export function File({ file }: { file: FileData }) {
    return (
      <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 items-center border-b-2 border-gray-100 py-2">
        <div className="cursor-default relative">
          📄 <p className="text-xs font-bold text-brand-500 absolute bottom-0">{file.type}</p>
        </div>
        <div data-testid="file-name" className="min-w-[2rem] truncate">
          {file.name}
        </div>
        <div className="min-w-[8rem] text-right">{file.added}</div>
      </div>
    );
  }
  