"use client";

import { FileData } from "@/types";
import { File } from "./File";
import { Folder } from "./Folder";

export function FileList({ files }: { files?: FileData[] }) {
  return files?.map((file, index) => {
    return (
      <li key={index}>
        {file.type === "folder" ? <Folder folder={file} /> : <File file={file} />}
      </li>
    );
  });
}
