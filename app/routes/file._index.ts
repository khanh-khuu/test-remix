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
  const outputPath = path.join("/tmp");
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
    if (fs.existsSync(path.join('/tmp', dir, 'thumbnail.png'))) {
        file.thumbnail = path.join('/tmp', dir, 'thumbnail.png');
    }

    if (fs.existsSync(path.join('/tmp', dir, 'input.mp4'))) {
        file.input = path.join('/tmp', dir, 'input.mp4');
    }

    if (fs.existsSync(path.join('/tmp', dir, 'output.mp4'))) {
        file.output = path.join('/tmp', dir, 'output.mp4');
    }

    if (fs.existsSync(path.join('/tmp', dir, 'description.txt'))) {
        const data = fs.readFileSync(path.join('/tmp', dir, 'description.txt'), 'utf8');
        file.description = data.toString();
    }

    result.push(file);

  }

  return Response.json(result);
};
