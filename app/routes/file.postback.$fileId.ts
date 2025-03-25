import fs from "fs";
import { ActionFunctionArgs } from "@remix-run/node";
import path from "path";
import axios from "axios";
import unzipper from "unzipper";

export async function action({ request, params }: ActionFunctionArgs) {
  const { fileId } = params;

  const { runId } = await request.json();

  if (!process.env.GITHUB_TOKEN) {
    return Response.json(
      {
        error: "Github Token is missing.",
      },
      { status: 400 }
    );
  }
  const endpoint = `https://api.github.com/repos/khanh-khuu/test-remix/actions/runs/${runId}/artifacts`;

  const { data } = await axios.get(endpoint, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
  });

  const downloadUrl = data.artifacts[0].archive_download_url;

  const downloadResponse = await axios({
    url: downloadUrl,
    method: "get",
    responseType: "stream",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
  });

  const tempZipPath = path.join("/tmp", "temp.zip");
  const outputPath = path.join("/tmp", fileId!);

  downloadResponse.data.pipe(fs.createWriteStream(tempZipPath));

  await new Promise((resolve, reject) => {
    downloadResponse.data.on("end", () => resolve(null));
    downloadResponse.data.on("error", reject);
  });

  await new Promise((resolve, reject) => {
    fs.createReadStream(tempZipPath)
      .pipe(unzipper.Extract({ path: outputPath }))
      .promise()
      .then(() => {
        resolve(null);
      })
      .catch(reject);
  });

  return Response.json({
    success: true,
  });
}
