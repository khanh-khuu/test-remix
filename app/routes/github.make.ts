import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import axios from "axios";
import path from "path";
import fs from "fs";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const downloadUrl = url.searchParams.get("url");

  const fileName = path.basename(downloadUrl!);
  const outputPath = path.join(process.cwd(), "temp", fileName);

  try {
    if (!fs.existsSync(path.join(process.cwd(), 'temp'))) fs.mkdirSync(path.join(process.cwd(), 'temp'));

    const writer = fs.createWriteStream(outputPath);

    const response = await axios.get(downloadUrl!, {
      responseType: "stream",
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", () => {
        resolve(Response.json({ filePath: outputPath }));
      });
      writer.on("error", reject);
    });
  } catch (error) {
    console.error("Error downloading the file:", error);
    return Response.json(
      { error: "Failed to download the file." },
      { status: 500 }
    );
  }
};
