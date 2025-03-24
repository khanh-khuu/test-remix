import fs from "fs";
import { ActionFunctionArgs } from "@remix-run/node";
import path from "path";

export async function action({ request, params }: ActionFunctionArgs) {
  const {fileId} = params;

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file)
    return Response.json(
      {
        error: "No file.",
      },
      { status: 400 }
    );

  if (!fs.existsSync(path.join(process.cwd(), "temp", fileId!)))
    return Response.json(
      {
        error: "Id invalid.",
      },
      { status: 400 }
    );

  const filePath = path.join(process.cwd(), "temp", fileId!, "output.mp4");
  const buffer = Buffer.from(await file.arrayBuffer());

  fs.writeFileSync(filePath, buffer);

  return Response.json({
    message: "Ok",
  });
}
