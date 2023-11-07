import { Card, Container, IconButton, List, Stack, Typography } from "@mui/joy";
import { db } from "~/server/db";
import { VideoCard } from "../_components/video-card";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Delete } from "@mui/icons-material";
import { Flex } from "../_components/flex";
dayjs.extend(relativeTime);

export default async function HistoryPage() {
  const videos = await db.video.findMany({ take: 10 });

  return (
    <Container>
      <List sx={{ gap: 2 }}>
        {videos.map((video) => (
          <Card key={video.id}>
            <Flex justifyContent="space-between">
              <Flex height={200} alignItems="center" gap={1}>
                <Typography>{dayjs(video.createdAt).fromNow()}</Typography>
                <VideoCard video={video} height="100%" />
              </Flex>
              <Stack justifyContent="center">
                <IconButton onClick={() => {}}>
                  <Delete />
                </IconButton>
              </Stack>
            </Flex>
          </Card>
        ))}
      </List>
    </Container>
  );
}
