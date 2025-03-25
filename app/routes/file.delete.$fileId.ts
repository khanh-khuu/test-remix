import { LoaderFunction } from "@remix-run/node";
import path from "path";
import fs from "fs";

export const action: LoaderFunction = async ({ params, request }) => {
  const { fileId } = params;

  const fullPath = path.join("/tmp", fileId!);

  fs.rmSync(fullPath, {
    recursive: true,
    force: true,
  });

  return Response.json({
    success: true,
  });
};
