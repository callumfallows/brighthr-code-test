import { useFileStorage } from "@/app/context/FileDirectoryContext";
import Link from "next/link";
import { ButtonToggle } from "./common/ButtonToggle";
import { FileList } from "./FileList";

export function FileDirectory() {
  const {
    files,
    toggleAlphabeticallySortAToZ,
    toggleDateSortNewToOld,
    searchInput,
    sortAlphabetically,
    sortByDate,
    onSearchChange
  } = useFileStorage();

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
              isToggled={toggleAlphabeticallySortAToZ}
              buttonText="Sort Alphabetically"
              toggleText1="A-Z"
              toggleText2="Z-A"
            />
            <ButtonToggle
              onClick={sortByDate}
              isToggled={toggleDateSortNewToOld}
              buttonText="Sort By Date"
              toggleText1="⬇"
              toggleText2="⬆"
            />
          </div>
        </div>

        <div className="bg-gray-100 mt-6 rounded-lg">
          <div className="flex w-full">
            <nav aria-label="breadcrumb flex">
              <ol className="p-4 w-full flex flex-row gap text-md">
                <li className="breadcrumb-item">
                  <Link className={`text-gray-500 font-extrabold`} href="/">
                    Home
                  </Link>
                </li>
              </ol>
            </nav>
          </div>
          <ul className="p-6 py-2 divide-y divide-gray-200">
            <FileList files={files} />
          </ul>
        </div>
      </div>
    </div>
  );
}
