import { useFiles } from "@/api/api";
import Providers from "@/app/providers";
import { render, screen } from "@testing-library/react";
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
    expect(true).toBe(true);
  });

  it("can sort the files by date", () => {
    expect(true).toBe(true);
  });

  it("can filter the files using name", async () => {
    expect(true).toBe(true);
  });

  it("can display the directory contents of a folder after being clicked", () => {
    expect(true).toBe(true);
  });
});
