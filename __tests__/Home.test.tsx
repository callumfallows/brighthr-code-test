import { useFiles } from "@/api/api";
import Providers from "@/app/providers";
import { fireEvent, render, screen } from "@testing-library/react";
import mockRouter from "next-router-mock";
import Home from "../pages/index";
import mockData from "./mocks/mock-data.json";

jest.mock("next/router", () => jest.requireActual("next-router-mock"));

// Mock the useFiles hook
jest.mock("../api/api", () => ({
  useFiles: jest.fn()
}));

const mockFiles = {
  data: mockData,
  isLoading: false
};
describe("Home", () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl("/");
  });
  beforeEach(() => {
    // Set up the mock implementation before each test
    (useFiles as jest.Mock).mockImplementation(() => mockFiles);
  });

  const App = () => {
    return (
      <Providers>
        <Home />
      </Providers>
    );
  };

  it("renders the document storage page", () => {
    render(<App />);
    const linkElement = screen.getByText(/Document Storage/i);
    expect(linkElement).toBeInTheDocument();
  });

  it("diplays a list of files", () => {
    render(<App />);

    const exampleFile1Name = mockData[0].name;

    const exampleFile1Element = screen.getByText(exampleFile1Name);

    expect(exampleFile1Element).toBeVisible();

    const exampleFile2Name = mockData[1].name;

    const exampleFile2Element = screen.getByText(exampleFile2Name);

    expect(exampleFile2Element).toBeVisible();
  });

  it("can sort the files alphabetically by name", () => {
    render(<App />);
    const firstFileInMockList = mockData[0];
    const allFilesInList = screen.getAllByTestId("file-name");

    expect(allFilesInList[0].innerHTML).toEqual(firstFileInMockList.name);

    const sortAlphabeticallyButton = screen.getByText("Sort Alphabetically A-Z");

    fireEvent.click(sortAlphabeticallyButton);

    const filesMockSortedAlphabetically = mockData.sort((a, b) => a.name.localeCompare(b.name));

    const allAlphabeticalFilesInList = screen.getAllByTestId("file-name");

    expect(allAlphabeticalFilesInList[0].innerHTML).toEqual(filesMockSortedAlphabetically[0].name);
  });

  it("can sort the files by date", () => {
    render(<App />);
    const firstFileInMockList = mockData[0];
    const allFilesInList = screen.getAllByTestId("file-name");

    expect(allFilesInList[0].innerHTML).toEqual(firstFileInMockList.name);

    const sortByDateButton = screen.getByText("Sort By Date ⬆");

    fireEvent.click(sortByDateButton);

    const filesMockSortedByDate = mockData.sort(
      (a, b) => new Date(b.added).getTime() - new Date(a.added).getTime()
    );

    const allFilesByDateInList = screen.getAllByTestId("file-name");

    expect(allFilesByDateInList[0].innerHTML).toEqual(
      filesMockSortedByDate[mockData.length - 1].name
    );
  });

  it("can filter the files using name", async () => {
    render(<App />);
    const filesInMock = mockData.filter((item) => item.type !== "folder");
    const allFilesInList = screen.getAllByTestId("file-name");

    expect(allFilesInList.length).toEqual(filesInMock.length);

    const filterFilesInput = await screen.findByPlaceholderText("Search by name");

    fireEvent.change(filterFilesInput, {
      target: { value: "Employee Handbook" }
    });

    const filteredFilesInList = screen.getAllByTestId("file-name");
    expect(filteredFilesInList.length).toEqual(1);
    expect(filteredFilesInList[0].innerHTML).toEqual("Employee Handbook");
  });

  it("can display the directory contents of a folder after being clicked", () => {
    render(<App />);
    const firstFolderInMock = mockData.filter((item) => item.type === "folder");

    const exampleFolder = screen.getByText(firstFolderInMock[0].name);

    fireEvent.click(exampleFolder);
    expect(mockRouter).toMatchObject({
      pathname: "/misc"
    });

    const filteredFilesInList = screen.getAllByTestId("file-name");
    expect(filteredFilesInList.length).toEqual(2);
  });
});
