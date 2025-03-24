import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import axios from "axios";
import path from "path";
import fs from "fs";

export const loader: LoaderFunction = async ({ request }) => {
//   const { fileUrl } = await request.json();
//   const fileName = path.basename(fileUrl);
//   const outputPath = path.join(process.cwd(), "temp", fileName);

//   try {
//     const writer = fs.createWriteStream(outputPath);

//     const response = await axios({
//       url: fileUrl,
//       method: "GET",
//       responseType: "stream",
//     });

//     response.data.pipe(writer);

//     return new Promise((resolve, reject) => {
//       writer.on("finish", () => {
//         resolve(Response.json({ filePath: outputPath }));
//       });
//       writer.on("error", reject);
//     });

//   } catch (error) {
//     console.error("Error downloading the file:", error);
//     return Response.json({ error: "Failed to download the file." }, { status: 500 });
//   }
return Response.json({hello: 'World'})
};