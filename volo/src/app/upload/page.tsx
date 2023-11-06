"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { upload } from "qiniu-js";
import {
  Autocomplete,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Input,
  LinearProgress,
  Snackbar,
  Stack,
  Textarea,
  Typography,
  styled,
} from "@mui/joy";
import { Upload, VideoFile } from "@mui/icons-material";
import { Flex } from "../_components/flex";

export const VisuallyHiddenInput = styled("input")`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState(false);

  const [progress, setProgress] = useState<number | null>(null);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedFile(file ?? null);
  };

  const getVideoUploadParameters =
    api.video.createVideoUploadParameters.useMutation();

  const onUploadClick = async () => {
    if (selectedFile) {
      const { key, token } = await getVideoUploadParameters.mutateAsync();
      upload(selectedFile, key, token, {}, {}).subscribe({
        next: (res) => {
          setProgress(res.total.percent);
        },
        error: () => {
          setError(true);
        },
        complete: () => {
          setProgress(null);
          setUploaded(true);
        },
      });
    }
  };
  return (
    <Container sx={{ py: 1 }}>
      <Stack gap={1}>
        <Card>
          <Stack gap={1}>
            <Stack direction="row" alignItems="center">
              <VideoFile sx={{ fontSize: 36 }} />
              <Stack display="flex" width="100%" gap={1}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography>{selectedFile?.name ?? "未选择文件"}</Typography>
                  <Flex
                    gap={1}
                    direction={{
                      xs: "column",
                      sm: "row",
                    }}
                  >
                    <Button
                      component="label"
                      role={undefined}
                      tabIndex={-1}
                      variant="outlined"
                      color="neutral"
                      startDecorator={<Upload />}
                    >
                      请选择文件
                      <VisuallyHiddenInput
                        type="file"
                        accept="video/*"
                        onChange={onFileChange}
                      />
                    </Button>
                    <Button
                      onClick={onUploadClick}
                      disabled={
                        selectedFile === null ||
                        progress !== null ||
                        getVideoUploadParameters.isLoading
                      }
                    >
                      确认上传
                    </Button>
                    <Button onClick={() => setSelectedFile(null)}>
                      取消选择
                    </Button>
                  </Flex>
                </Stack>
                <LinearProgress
                  determinate={getVideoUploadParameters.isSuccess}
                  value={progress ?? 0}
                />
              </Stack>
            </Stack>
          </Stack>
        </Card>
        <Card>
          <Typography level="title-lg">视频信息</Typography>
          <Divider inset="none" />
          <CardContent
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(80px, 1fr))",
              gap: 1.5,
            }}
          >
            <FormControl sx={{ gridColumn: "1/-1" }}>
              <FormLabel>标题</FormLabel>
              <Input />
            </FormControl>
            <FormControl sx={{ gridColumn: "1/-1" }}>
              <FormLabel>简介</FormLabel>
              <Textarea minRows={2} />
            </FormControl>
            <FormControl
              sx={(theme) => ({
                [theme.breakpoints.down("sm")]: {
                  gridColumn: "1/-1",
                },
              })}
            >
              <FormLabel>分类</FormLabel>
              <Autocomplete options={["Option 1", "Option 2"]} />
            </FormControl>
            <FormControl
              sx={(theme) => ({
                [theme.breakpoints.down("sm")]: {
                  gridColumn: "1/-1",
                },
              })}
            >
              <FormLabel>标签</FormLabel>
              <Autocomplete
                multiple
                options={["Option 1", "Option 2"]}
                sx={(theme) => ({
                  [theme.breakpoints.down("sm")]: {
                    gridColumn: "1/-1",
                  },
                })}
              />
            </FormControl>
            <CardActions sx={{ gridColumn: "1/-1" }}>
              <Button variant="solid" color="success">
                立即投稿
              </Button>
            </CardActions>
          </CardContent>
        </Card>
      </Stack>
      <Snackbar
        variant="solid"
        color="success"
        autoHideDuration={1600}
        open={uploaded}
        onClose={() => setUploaded(false)}
      >
        已上传
      </Snackbar>
      <Snackbar
        variant="solid"
        color="warning"
        autoHideDuration={1600}
        open={error}
        onClose={() => setError(false)}
      >
        上传失败
      </Snackbar>
    </Container>
  );
}
