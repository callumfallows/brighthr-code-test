import { useFiles } from "@/api/api";
import { FileData } from "@/types";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

interface FileDirectoryContextType {
  files: FileData[] | undefined;
  toggleAlphabeticallySortAToZ: boolean;
  toggleDateSortNewToOld: boolean;
  searchInput: string;
  sortAlphabetically: () => void;
  sortByDate: () => void;
  setFiles: React.Dispatch<React.SetStateAction<FileData[] | undefined>>;
  onSearchChange: (input: string) => void;
}

export const FileDirectoryContext = createContext<FileDirectoryContextType | null>(null);

export function FileDirectoryProvider({ children }: { children: React.ReactNode }) {
  const { data: response, isLoading } = useFiles();

  const [toggleAlphabeticallySortAToZ, setToggleAlphabeticallySortAToZ] = useState(true);
  const [toggleDateSortNewToOld, setToggleDateSortNewToOld] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [files, setFiles] = useState<FileData[] | undefined>([]);

  useEffect(() => {
    if (!isLoading && response) {
      setFiles(response);
    }
  }, [response, isLoading]);

  const sortAlphabetically = useCallback(() => {
    setToggleAlphabeticallySortAToZ(!toggleAlphabeticallySortAToZ);
  }, [toggleAlphabeticallySortAToZ]);

  const sortByDate = useCallback(() => {
    setToggleDateSortNewToOld(!toggleDateSortNewToOld);
  }, [toggleDateSortNewToOld]);

  const value = {
    files: files,
    toggleAlphabeticallySortAToZ,
    toggleDateSortNewToOld,
    searchInput,
    sortAlphabetically,
    sortByDate,
    setFiles,
    onSearchChange: setSearchInput
  };

  return <FileDirectoryContext.Provider value={value}>{children}</FileDirectoryContext.Provider>;
}

export function useFileStorage() {
  const context = useContext(FileDirectoryContext);
  if (!context) {
    throw new Error("useFileStorage must be used within a FileStorageProvider");
  }
  return context;
}
