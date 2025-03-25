import { LoaderFunction } from "@remix-run/node";
import path from "path";
import fs from "fs";
import mime from 'mime';

export const loader: LoaderFunction = async ({ params, request }) => {
  const { fileId, fileName } = params;

  const download = new URL(request.url).searchParams.get('download');
  
  const fullPath = path.join('/tmp', fileId!, fileName!);
 
  fs.accessSync(fullPath);

  const fileBuffer = fs.readFileSync(fullPath);
  const fileStat = fs.statSync(fullPath);
  const fileMime = mime.getType(fullPath);

  const headers: Record<string, string> = {
    "Content-Type": fileMime || "application/octet-stream",
    "Content-Length": fileStat.size.toString(),
  };

  if (download !== null) {
    headers["Content-Disposition"] = `attachment; filename="${fileId + '-' + fileName}"`;
  }
  return new Response(fileBuffer, {
    headers,
  });
};
