import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import axios from "axios";

export const action: ActionFunction = async ({ request, params }) => {
  const { fileId } = params;
  const { cmd } = await request.json();

  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;
  
  const postback = `${baseUrl}/file/postback/${fileId}`;
  const vid_url = `${baseUrl}/file/${fileId}/input.mp4`;

  if (!process.env.GITHUB_TOKEN) {
    return Response.json(
      {
        error: "Github Token is missing.",
      },
      { status: 400 }
    );
  }
  const endpoint = `https://api.github.com/repos/khanh-khuu/test-remix/actions/workflows/151632073/dispatches`;
  try {
    await axios.post(
      endpoint,
      {
        ref: "main",
        inputs: {
          vid_url,
          cmd,
          postback,
        },
      },
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
      }
    );
    return Response.json({
      success: true,
    });
  } catch (err: any) {
    return Response.json(err.response.data, {
      status: err.response.data.status,
    });
  }
};
