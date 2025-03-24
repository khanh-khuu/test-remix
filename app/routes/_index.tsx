import { Button, Card, Group, TextInput } from "@mantine/core";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App!!" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  function downloadVideo() {
    const audio = document.getElementById("notificationSound");
    (audio! as HTMLAudioElement).pause();
    (audio! as HTMLAudioElement).currentTime = 0;
    (audio! as HTMLAudioElement).play();
  }

  return (
    <Card
      style={{
        maxWidth: 500,
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "2em",
      }}
      radius={"lg"}
    >
      <audio id="notificationSound" src="/done.mp3"></audio>

      <Group>
        <TextInput flex={1} />
        <Button onClick={downloadVideo}>Download</Button>
      </Group>
    </Card>
  );
}
