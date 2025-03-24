import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import axios from "axios";
import path from "path";
import fs from "fs";

interface VideoFile {
  id: string;
  input: string | null;
  output: string | null;
  description: string | null;
  thumbnail: string | null;
}

export const loader: LoaderFunction = async () => {
  const outputPath = path.join(process.cwd(), "temp");
  if (!fs.existsSync(outputPath)) return Response.json([]);

  const dirs = fs
    .readdirSync(outputPath, { withFileTypes: true })
    .filter((x) => x.isDirectory())
    .map((x) => x.name);

  const result: VideoFile[] = [];

  for (const dir of dirs) {
    const file: VideoFile = {
        id: dir,
        description: null,
        input: null,
        output: null,
        thumbnail: null,
    };
    if (fs.existsSync(path.join(process.cwd(), 'temp', dir, 'thumbnail.png'))) {
        file.thumbnail = path.join(process.cwd(), 'temp', dir, 'thumbnail.png');
    }

    if (fs.existsSync(path.join(process.cwd(), 'temp', dir, 'input.mp4'))) {
        file.input = path.join(process.cwd(), 'temp', dir, 'input.mp4');
    }

    if (fs.existsSync(path.join(process.cwd(), 'temp', dir, 'output.mp4'))) {
        file.output = path.join(process.cwd(), 'temp', dir, 'output.mp4');
    }

    if (fs.existsSync(path.join(process.cwd(), 'temp', dir, 'description.txt'))) {
        const data = fs.readFileSync(path.join(process.cwd(), 'temp', dir, 'description.txt'), 'utf8');
        file.description = data.toString();
    }

    result.push(file);

  }

  return Response.json(result);
};
