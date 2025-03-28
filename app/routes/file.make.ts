import { ActionFunction } from "@remix-run/node";
import axios from "axios";
import _ from "lodash";
import { Crop } from "react-image-crop";
import generateGithubName from "~/helper/generateGithubName";
import removeEmojis from "~/helper/removeEmoji";
import removeHashTag from "~/helper/removeHashTag";

export const action: ActionFunction = async ({ request }) => {
  const {
    crop,
    description,
    caption,
  }: {
    crop: Crop;
    description: string;
    caption: string;
  } = await request.json();

  const caps = removeEmojis(removeHashTag(caption)).trim();
  const githubName = generateGithubName(description);

  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  // const postback = `${baseUrl}/file/postback/${fileId}`;
  const vid_url = `${baseUrl}/file/input.mp4`;
  const width = 1080;
  const height = 1920;

  const captionsArr = _.chunk(caps.split(" "), 4).map((chunk, idx) => {
    return removeEmojis(chunk.join(" ")).trim();
  });

  const textPosition = 0.62;

  const captions = captionsArr.map((line, idx) => {
    return `[output]drawtext=fontfile=/lib/LeagueSpartan-Bold.ttf:text='${line}':x=(w-text_w)*0.5:y=(h-text_h)*${textPosition}+(${idx}*54):fontsize=48:fontcolor=white:shadowcolor=black:shadowx=2:shadowy=2[output]`;
  });

  let cmd = 'ffmpeg -i input.mp4 -filter_complex "';
  cmd += [
    `[0]crop=${Number(crop.width) / 100}*iw:${Number(crop.height) / 100}*ih:${
      Number(crop.x) / 100
    }*in_w:${Number(crop.y) / 100}*in_h[origin]`,
    `[origin]scale=${width}:${Math.ceil(height * 0.55)},setsar=1:1[origin]`,
    `[origin]split[top][bottom]`,
    `[top]pad=iw:2*ih,vaguedenoiser,eq=brightness=-0.05:contrast=0.95:saturation=0.95,hqdn3d=4:3:6:4.5,deband,convolution,unsharp=23:3:1.8[top]`,
    `[bottom]boxblur=10,eq=brightness=-0.45:contrast=0.9:saturation=0.4[bottom]`,
    `[top][bottom]overlay=0:h[full]`,
    `[full]crop=${width}:${height}:0:0[output]`,
    // `[full]scale=${width}:${height},setsar=1:1,format=gbrp[output]`,
    ...captions,
    `[output]pad=iw:ih+ih*0.15:(iw-iw)/2:(ih*0.15)/2:black`,
  ].join(";");

  cmd += `" -shortest output.mp4`;

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
          // postback,
          description: githubName,
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
