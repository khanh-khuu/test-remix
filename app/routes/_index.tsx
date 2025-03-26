import { Card } from "@mantine/core";
import type { MetaFunction } from "@remix-run/node";
import FileList from "~/components/file-list";
import Maker from "~/components/maker";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App!!" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {

  return (
    <Card
      style={{
        maxWidth: 1100,
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "2em",
      }}
      radius={"lg"}
    >
      <Maker />
      <FileList />
    </Card>
  );
}
