import { useFiles } from "@/api/api";
import { FileData } from "@/types";
import { useRouter } from "next/router";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

interface FileDirectoryContextType {
  isLoading: boolean;
  files: FileData[] | undefined;
  filteredFiles: FileData[] | undefined;
  sortConfig: {
    alphabetical: {
      enabled: boolean;
      isAscending: boolean;
    };
    date: {
      enabled: boolean;
      isNewToOld: boolean;
    };
  };
  searchInput: string;
  sortAlphabetically: () => void;
  sortByDate: () => void;
  onSearchChange: (input: string) => void;
}

export const FileDirectoryContext = createContext<FileDirectoryContextType | null>(null);

interface DirectoryState {
  sortConfig: {
    alphabetical: {
      enabled: boolean;
      isAscending: boolean;
    };
    date: {
      enabled: boolean;
      isNewToOld: boolean;
    };
  };
  searchInput: string;
  files: FileData[] | undefined;
  filteredFiles: FileData[] | undefined;
  isLoading?: boolean;
}

type DirectoryAction =
  | { type: "TOGGLE_ALPHA_SORT" }
  | { type: "TOGGLE_DATE_SORT" }
  | { type: "SET_FILES"; payload: FileData[] }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_FILTERED_FILES"; payload: FileData[] };

function filterFilesByName(
  state: DirectoryState,
  action: { type: "SET_SEARCH"; payload: string }
): FileData[] | undefined {
  return state.files?.filter((file: FileData) =>
    file.name.toLowerCase().includes(action.payload?.toLowerCase())
  );
}

function sortFilesByDate(
  state: DirectoryState,
  action: { type: "TOGGLE_DATE_SORT" }
): FileData[] | undefined {
  return state.filteredFiles?.sort((a, b) =>
    action.type === "TOGGLE_DATE_SORT" && state.sortConfig.date.isNewToOld
      ? new Date(b.added).getTime() - new Date(a.added).getTime()
      : new Date(a.added).getTime() - new Date(b.added).getTime()
  );
}

function sortFilesAlphabetically(
  state: DirectoryState,
  action: { type: "TOGGLE_ALPHA_SORT" }
): FileData[] | undefined {
  return state.filteredFiles?.sort((a, b) =>
    action.type === "TOGGLE_ALPHA_SORT" && state.sortConfig.alphabetical.isAscending
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name)
  );
}

const directoryReducer = (state: DirectoryState, action: DirectoryAction): DirectoryState => {
  switch (action.type) {
    case "TOGGLE_ALPHA_SORT":
      return {
        ...state,
        sortConfig: {
          ...state.sortConfig,
          alphabetical: {
            enabled: true,
            isAscending: !state.sortConfig.alphabetical.isAscending
          },
          date: {
            ...state.sortConfig.date,
            enabled: false
          }
        },
        filteredFiles: sortFilesAlphabetically(state, action)
      };
    case "TOGGLE_DATE_SORT":
      return {
        ...state,
        sortConfig: {
          ...state.sortConfig,
          date: {
            enabled: true,
            isNewToOld: !state.sortConfig.date.isNewToOld
          },
          alphabetical: {
            ...state.sortConfig.alphabetical,
            enabled: false
          }
        },
        filteredFiles: sortFilesByDate(state, action)
      };
    case "SET_SEARCH":
      return {
        ...state,
        searchInput: action.payload,
        filteredFiles: filterFilesByName(state, action)
      };

    case "SET_FILES":
      return {
        ...state,
        files: action.payload
      };

    case "SET_FILTERED_FILES":
      return {
        ...state,
        filteredFiles: action.payload
      };
    default:
      return state;
  }
};

export function FileDirectoryProvider({ children }: { children: React.ReactNode }) {
  const { data: response, isLoading: isLoadingFiles } = useFiles();
  const { asPath } = useRouter();

  const [directoryName, setDirectoryName] = useState("");

  const [state, dispatch] = React.useReducer(directoryReducer, {
    sortConfig: {
      alphabetical: {
        enabled: true,
        isAscending: true
      },
      date: {
        enabled: false,
        isNewToOld: false
      }
    },
    searchInput: "",
    filteredFiles: undefined,
    files: undefined,
    isLoading: true
  });

  useEffect(() => {
    setDirectoryName(asPath?.split("/")[1]);
  }, [asPath]);

  useEffect(() => {
    if (response) {
      dispatch({ type: "SET_FILES", payload: response });
    }
  }, [response]);

  const setSearch = (input: string) => {
    if (typeof input !== "string") return;
    const sanitizedInput = input.trim();
    dispatch({ type: "SET_SEARCH", payload: sanitizedInput.toLowerCase() });
  };
  // Handle directory filtering
  const currentDirectory = useMemo(() => {
    const directory =
      directoryName &&
      response?.filter((file: FileData) =>
        file.name.toLowerCase().includes(directoryName?.toLowerCase())
      );

    if (directory && directory?.length > 0) {
      return directory[0].files;
    }

    return response;
  }, [response, directoryName]);

  useEffect(() => {
    try {
      if (currentDirectory) {
        dispatch({ type: "SET_FILTERED_FILES", payload: currentDirectory });
      }
    } catch (error) {
      // Handle error appropriately
      console.error("Failed to set filtered files:", error);
    }
  }, [currentDirectory]);

  useEffect(() => {
    if (!currentDirectory) return undefined;

    const searchFiltered = state.searchInput
      ? currentDirectory.filter((file) =>
          file.name.toLowerCase().includes(state.searchInput.toLowerCase())
        )
      : currentDirectory;

    const sorted = [...searchFiltered];
    dispatch({ type: "SET_FILTERED_FILES", payload: sorted });
  }, [currentDirectory, state.searchInput]);

  const sortAlphabetically = useCallback(() => {
    dispatch({ type: "TOGGLE_ALPHA_SORT" });
  }, []);

  const sortByDate = useCallback(() => {
    dispatch({ type: "TOGGLE_DATE_SORT" });
  }, []);

  const value = {
    isLoading: isLoadingFiles,
    files: response,
    filteredFiles: state.filteredFiles,
    sortConfig: state.sortConfig,
    searchInput: state.searchInput,
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
