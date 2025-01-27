import { FileData } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const fetchFiles = async (): Promise<FileData[]> => {
  return (await fetch("/api/files")).json();
};

export const useFiles = () => {
  return useQuery<FileData[], Error>({
    queryKey: ["files"],
    queryFn: fetchFiles
  });
};
