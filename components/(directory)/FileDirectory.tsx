import { useFileStorage } from "@/app/context/FileDirectory/FileDirectoryContext";
import { useRouter } from "next/router";
import { Breadcrumbs } from "../common/Breadcrumbs";
import { ButtonToggle } from "../common/ButtonToggle";
import { FileList } from "./FileList";
const SKELETON_COUNT = 3 as const;

const skeletonArray: readonly number[] = [...Array(SKELETON_COUNT)];

export function FileDirectory() {
  const {
    files,
    filteredFiles,
    isLoading,
    searchInput,
    sortAlphabetically,
    sortConfig,
    sortByDate,
    onSearchChange
  } = useFileStorage();

  const { route, back } = useRouter();

  const subdirectory = route !== "/";

  return (
    <div className="p-0">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-row">
          <h1 className="text-3xl font-bold">Document Storage</h1>
        </div>
        <div className="flex flex-col items-center">
          <div className="pt-6 w-full">
            <input
              className="appearance-none block w-full text-gray-700 border border-primary-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              type="text"
              value={searchInput}
              name="search"
              placeholder="Search by name"
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <div className="flex flex-row w-full justify-end gap-4 pr-4">
            <ButtonToggle
              onClick={sortAlphabetically}
              isToggled={sortConfig.alphabetical.isAscending}
              buttonText="Sort Alphabetically"
              toggleText1="A-Z"
              toggleText2="Z-A"
              aria-label={`Sort alphabetically ${sortConfig.alphabetical.isAscending ? "A to Z" : "Z to A"}`}
            />
            <ButtonToggle
              onClick={sortByDate}
              isToggled={sortConfig.date.isNewToOld}
              buttonText="Sort By Date"
              toggleText1="⬇"
              toggleText2="⬆"
              aria-label={`Sort by date ${sortConfig.date.isNewToOld ? "newest to oldest" : "oldest to newest"}`}
            />
          </div>
        </div>

        <div className="bg-gray-100 mt-6 rounded-lg">
          <div className="flex w-full">
            <nav aria-label="breadcrumb flex">
              <Breadcrumbs />
            </nav>
          </div>
          <div className="flex flex-row px-4">
            {subdirectory && (
              <button onClick={() => back()} className="text-sm p-2 text-gray-900 hover:underline">
                ↑ Back
              </button>
            )}
          </div>
          <ul
            className="p-6 py-2 divide-y divide-gray-200"
            role="list"
            aria-label="File directory listing">
            {isLoading ? (
              skeletonArray.map((_, index) => (
                <li key={index} aria-hidden="true">
                  <div className="animate-pulse bg-gray-200 h-10 mb-2 w-full"></div>
                </li>
              ))
            ) : (
              <FileList files={filteredFiles || files} aria-label="List of files and folders" />
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
