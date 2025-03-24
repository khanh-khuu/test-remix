import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import axios from "axios";
import path from "path";
import fs from "fs";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const downloadUrl = url.searchParams.get("url");

  const id = Date.now().toString();
  const outputPath = path.join(process.cwd(), "temp", id, 'input.mp4');

  try {
    if (!fs.existsSync(path.join(process.cwd(), 'temp'))) fs.mkdirSync(path.join(process.cwd(), 'temp'));
    if (!fs.existsSync(path.join(process.cwd(), 'temp', id))) fs.mkdirSync(path.join(process.cwd(), 'temp', id));
    const writer = fs.createWriteStream(outputPath);

    const response = await axios.get(downloadUrl!, {
      responseType: "stream",
    });

    response.data.pipe(writer);

    fs.writeFileSync(path.join(process.cwd(), "temp", id, 'description.txt'), path.basename(downloadUrl!), {
        encoding: 'utf-8'
    });

    return new Promise((resolve, reject) => {
      writer.on("finish", () => {
        resolve(Response.json({ filePath: outputPath }));
      });
      writer.on("error", reject);
    });
  } catch (error) {
    
    return Response.json(
      { error: "Failed to download the file." },
      { status: 500 }
    );
  }
};
