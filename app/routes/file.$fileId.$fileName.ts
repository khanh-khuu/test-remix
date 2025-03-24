import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import axios from "axios";
import path from "path";
import fs from "fs";
import mime from 'mime';

interface VideoFile {
  id: string;
  input: string | null;
  output: string | null;
  description: string | null;
  thumbnail: string | null;
}

export const loader: LoaderFunction = async ({ params, request }) => {
  const { fileId, fileName } = params;

  const download = new URL(request.url).searchParams.get('download');

  const fullPath = path.join(process.cwd(), 'temp', fileId!, fileName!);

  fs.accessSync(fullPath);

  const fileBuffer = fs.readFileSync(fullPath);
  const fileMime = mime.getType(fullPath);

  const headers: Record<string, string> = {
    "Content-Type": fileMime || "application/octet-stream",
  };

  if (download) {
    headers["Content-Disposition"] = `attachment; filename="${fileId + '-' + fileName}"`;
  }
  return new Response(fileBuffer, {
    headers,
  });
};
