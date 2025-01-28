import { useFiles } from "@/api/api";
import { FileData } from "@/types";
import { useRouter } from "next/router";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

interface FileDirectoryContextType {
  files: FileData[] | undefined;
  toggleAlphabeticallySortAToZ: boolean;
  toggleDateSortNewToOld: boolean;
  searchInput: string;
  sortAlphabetically: () => void;
  sortByDate: () => void;
  onSearchChange: (input: string) => void;
}

export const FileDirectoryContext = createContext<FileDirectoryContextType | null>(null);

export function FileDirectoryProvider({ children }: { children: React.ReactNode }) {
  const { data: response } = useFiles();
  const { asPath } = useRouter();

  const [directoryName, setDirectoryName] = useState("");

  const [toggleAlphabeticallySortAToZ, setToggleAlphabeticallySortAToZ] = useState(true);
  const [toggleDateSortNewToOld, setToggleDateSortNewToOld] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    setDirectoryName(asPath?.split("/")[1]);
  }, [asPath]);

  const setSearch = (input: string) => {
    setSearchInput(input.toLowerCase());
  };

  const currentDirectory = useMemo(() => {
    const searchTerm = (file: FileData) => {
      return file.name.toLowerCase().includes(searchInput.toLowerCase());
    };
    const directory =
      directoryName &&
      response?.filter((file: FileData) =>
        file.name.toLowerCase().includes(directoryName?.toLowerCase())
      );

    if (directory && directory?.length > 0) {
      return directory && directory[0].files
        ? directory[0].files.filter(searchTerm)
        : directory[0].files;
    }

    const filteredFiles = response?.filter(searchTerm);
    if (filteredFiles) {
      return filteredFiles;
    }

    return response;
  }, [response, directoryName, searchInput]);

  const sortAlphabetically = useCallback(() => {
    let sortedFiles;
    if (toggleAlphabeticallySortAToZ) {
      sortedFiles = currentDirectory?.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      sortedFiles = currentDirectory?.sort((a, b) => b.name.localeCompare(a.name));
    }

    setToggleAlphabeticallySortAToZ(!toggleAlphabeticallySortAToZ);
    return sortedFiles;
  }, [currentDirectory, toggleAlphabeticallySortAToZ]);

  const sortByDate = useCallback(() => {
    let sortedFiles;

    if (toggleDateSortNewToOld) {
      sortedFiles = currentDirectory?.sort(
        (a: FileData, b: FileData) => new Date(b.added).getTime() - new Date(a.added).getTime()
      );
    } else {
      sortedFiles = currentDirectory?.sort(
        (a: FileData, b: FileData) => new Date(a.added).getTime() - new Date(b.added).getTime()
      );
    }
    setToggleDateSortNewToOld(!toggleDateSortNewToOld);
    return sortedFiles;
  }, [currentDirectory, toggleDateSortNewToOld]);

  const value = {
    files: currentDirectory,
    toggleAlphabeticallySortAToZ,
    toggleDateSortNewToOld,
    searchInput,
    sortAlphabetically,
    sortByDate,
    onSearchChange: setSearch
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
