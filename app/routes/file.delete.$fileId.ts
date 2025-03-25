import { LoaderFunction } from "@remix-run/node";
import path from "path";
import fs from "fs";

export const action: LoaderFunction = async ({ params, request }) => {
  const { fileId } = params;

  if (fs.existsSync("/tmp/" + fileId! + ".input.mp4")) fs.rmSync("/tmp/" + fileId! + ".input.mp4");
  if (fs.existsSync("/tmp/" + fileId! + ".output.mp4")) fs.rmSync("/tmp/" + fileId! + ".output.mp4");
  if (fs.existsSync("/tmp/" + fileId! + ".txt")) fs.rmSync("/tmp/" + fileId! + ".txt");
  
  return Response.json({
    success: true,
  });
};
