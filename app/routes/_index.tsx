import {
  Button,
  Card,
  Group,
  TextInput,
  Table,
  ActionIcon,
  CloseIcon,
  Box,
  Image,
  Stack,
  Textarea,
  Loader,
  CopyButton,
  List,
  ThemeIcon,
} from "@mantine/core";
import type { MetaFunction } from "@remix-run/node";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import ReactCrop, { type Crop } from "react-image-crop";
import { VideoThumbnailGenerator } from "browser-video-thumbnail-generator";
import { useDeepCompareEffect } from "ahooks";
import {
  IconCircleDashed,
  IconClipboard,
  IconClipboardCheckFilled,
  IconDownload,
  IconShare2,
} from "@tabler/icons-react";
import removeEmojis from "~/helper/removeEmoji";
import removeHashTag from "~/helper/removeHashTag";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App!!" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

interface VideoFile {
  id: string;
  description: string;
  input: string;
  output: string;
}

export default function Index() {
  const [init, setInit] = useState(false);
  const [url, setUrl] = useState("https://www.tiktok.com/@funnyvideo_offlina/video/7330887021814107425?q=funny%20dog&t=1742896078195");
  const [activeId, setActiveId] = useState("");
  const [files, setFiles] = useState<VideoFile[]>([]);
  const [thumbnail, setThumbnail] = useState("");
  const [description, setDescription] = useState("");
  const thumbnailGenerator = useRef<VideoThumbnailGenerator>();

  const activeFile = files.find((x) => x.id === activeId);

  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  });

  function playSound() {
    const audio = document.getElementById("notificationSound");
    (audio! as HTMLAudioElement).pause();
    (audio! as HTMLAudioElement).currentTime = 0;
    (audio! as HTMLAudioElement).play();
  }

  async function downloadVideo() {
    if (!url) return;
    const {
      data: { id, description },
    } = await axios.get("/file/import?url=" + url);
    setActiveId(id);
    setDescription(removeEmojis(removeHashTag(description)).trim());
    setUrl("");
  }

  async function deleteFile(fileId: string) {
    await axios.post("/file/delete/" + fileId);
    setFiles(files.filter((x) => x.id !== fileId));
  }

  async function make() {
    await axios.post(`/file/make/${activeId}`, {
      crop,
      description,
    });
    setCrop({
      unit: "%",
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    });
    setDescription("");
    setActiveId("");
    setThumbnail("");
  }

  useEffect(() => {
    const timerId = setInterval(() => {
      axios.get<VideoFile[]>("/file").then(({ data }) => {
        setFiles(data.filter((x) => x.id !== activeId));
        setInit(true);
      });
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  useDeepCompareEffect(() => {
    if (!init) return;
    playSound();
  }, [files.map(x => x.id + x.output)]);

  useEffect(() => {
    thumbnailGenerator.current?.revokeUrls();
    if (!activeId || !activeFile?.input) return;

    thumbnailGenerator.current = new VideoThumbnailGenerator(activeFile.input);

    thumbnailGenerator.current.getThumbnail("middle").then((thumb) => {
      setThumbnail(thumb.thumbnail);
    });
  }, [activeId]);

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
      <audio id="notificationSound" src="/done.mp3"></audio>

      <Group>
        <TextInput
          flex={1}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button onClick={downloadVideo} disabled={!url}>
          Download
        </Button>
      </Group>

      {activeFile && (
        <Stack mt="lg">
          <Box ta="center">
            <ReactCrop
              crop={crop}
              onChange={(_crop, percentCrop) => setCrop(percentCrop)}
            >
              <Image src={thumbnail} style={{ width: 300 }} />
            </ReactCrop>
          </Box>

          <Box>
            <Textarea
              placeholder="Description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Box>

          <Button onClick={make}>Make</Button>
        </Stack>
      )}

      <Table mt="lg" layout="fixed">
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: "60%" }}>Description</Table.Th>
            <Table.Th ta="center">Input</Table.Th>
            <Table.Th ta="center">Output</Table.Th>
            <Table.Th ta="center">#</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {files.map((x) => (
            <Table.Tr key={x.id}>
              <Table.Td>
                <Group wrap="nowrap">
                  <Box flex={1}>{x.description}</Box>
                  <CopyButton value={x.description}>
                    {({ copied, copy }) => (
                      <ActionIcon
                        variant="transparent"
                        color={copied ? "teal" : "blue"}
                        onClick={copy}
                      >
                        {copied ? (
                          <IconClipboardCheckFilled />
                        ) : (
                          <IconClipboard />
                        )}
                      </ActionIcon>
                    )}
                  </CopyButton>
                </Group>
              </Table.Td>
              <Table.Td ta="center">
                <Group wrap="nowrap" gap="xs" justify="center" align="center">
                  {!x.input ? (
                    <Loader type="dots" />
                  ) : (
                    <>
                      <ActionIcon
                        variant="transparent"
                        onClick={() => window.open(x.input, "_blank")}
                      >
                        <IconShare2 />
                      </ActionIcon>
                      <ActionIcon
                        variant="transparent"
                        onClick={() =>
                          window.open(x.input + "?download", "_blank")
                        }
                      >
                        <IconDownload />
                      </ActionIcon>
                    </>
                  )}
                </Group>
              </Table.Td>
              <Table.Td ta="center">
                <Group wrap="nowrap" gap="xs" justify="center" align="center">
                  {!x.output ? (
                    <Loader type="dots" />
                  ) : (
                    <>
                      <ActionIcon
                        variant="transparent"
                        onClick={() => window.open(x.output, "_blank")}
                      >
                        <IconShare2 />
                      </ActionIcon>
                      <ActionIcon
                        variant="transparent"
                        onClick={() =>
                          window.open(x.output + "?download", "_blank")
                        }
                      >
                        <IconDownload />
                      </ActionIcon>
                    </>
                  )}
                </Group>
              </Table.Td>
              <Table.Td ta="center">
                {activeId !== x.id && (
                  <ActionIcon onClick={() => deleteFile(x.id)}>
                    <CloseIcon />
                  </ActionIcon>
                )}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
}
