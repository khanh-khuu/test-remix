import { LoaderFunction } from "@remix-run/node";
import axios from "axios";
import _ from "lodash";

export const loader: LoaderFunction = async ({ request, params }) => {
  
  const endpoint = `https://api.github.com/repos/khanh-khuu/test-remix/actions/runs`;
  try {
    const { data } = await await axios.get(
      endpoint,
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
      }
    );
    return Response.json(data);
  } catch (err: any) {
    return Response.json(err.response.data, {
      status: err.response.data.status,
    });
  }
};
