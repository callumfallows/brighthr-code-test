import { NextResponse } from "next/server";
import file from "../../../data/files.json";

export async function GET() {
  return NextResponse.json(
    file.map((file) => {
      if (file.type === "folder" && Array.isArray(file.files)) {
        const mostRecentDate = file.files.reduce((latest, item) => {
          const fileDate = new Date(item.added);
          return fileDate > latest ? fileDate : latest;
        }, new Date(0));

        return {
          ...file,
          slug: file.name.replace(/\s+/g, "-").toLowerCase(),
          added: mostRecentDate.toISOString().split("T")[0]
        };
      }

      return {
        ...file
      };
    })
  );
}
