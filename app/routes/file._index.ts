import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import axios from "axios";
import path from "path";
import fs from "fs";

interface VideoFile {
  id: string;
  input: string | null;
  output: string | null;
  description: string | null;
}

export const loader: LoaderFunction = async () => {
  const outputPath = path.join("/tmp");
  if (!fs.existsSync(outputPath)) return Response.json([]);

  const files = fs
    .readdirSync(outputPath, { withFileTypes: true })
    .filter((x) => x.isFile())
    .map((x) => x.name);

  const obj: Record<string, VideoFile> = {};

  for (const file of files) {
    if (file.endsWith('.input.mp4')) {
      const id = file.replace('.input.mp4', '');
      obj[id] = {
        ...obj[id],
        id,
        input: `/file/${file}`,
      };
    }

    if (file.endsWith('.output.mp4')) {
      const id = file.replace('.output.mp4', '');
      obj[id] = {
        ...obj[id],
        id,
        output: `/file/${file}`,
      };
    }

    if (file.endsWith('.txt')) {
      const id = file.replace('.txt', '');
      const data = fs.readFileSync(path.join('/tmp', id + '.txt'), 'utf8');
      obj[id] = {
        ...obj[id],
        id,
        description: data.toString(),
      };
    }
  }

  return Response.json(Object.values(obj));
};
