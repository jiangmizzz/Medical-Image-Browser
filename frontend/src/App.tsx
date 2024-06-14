// import { useState } from "react";
import "./App.css";
import "./assets/reset.css";
import {
  Box,
  Center,
  Flex,
  Heading,
  VStack,
  HStack,
  Text,
  Grid,
  GridItem,
  Divider,
  AspectRatio,
  ButtonGroup,
  IconButton,
} from "@chakra-ui/react";
import { useState } from "react";

import ZoomControl from "./components/ZoomControl";
import Tag from "./components/Tag";
import Edit from "./components/Edit";
import Reload from "./components/Reload";
import Measure from "./components/Measure";
import ImgDir from "./components/ImgDir";
import { useFileStore } from "./stores/filesStore";
import { useCountStore } from "./stores/countStore";
import { useToast } from "@chakra-ui/react";
import { DirType } from "./vite-env";
import ImgWindow from "./components/ImgWindow";
import { Empty, Image, Upload } from "@douyinfe/semi-ui";
import {
  IllustrationNoContent,
  IllustrationNoContentDark,
} from "@douyinfe/semi-illustrations";
import { IconCamera, IconGridView, IconStop } from "@douyinfe/semi-icons";
import type { FileItem } from "@douyinfe/semi-ui/lib/es/upload";

const boxCfg = {
  borderWidth: "1px",
  rounded: "md",
  boxShadow: "base",
  overflow: "hidden",
  fontFamily: "Arial",
};

type ModeType = "single" | "grid";

function BoxHeader(
  props: {
    title: string;
  } & (
    | { position: "l" | "r" }
    | {
        position: "m";
        mode: ModeType;
        changeMode: (mode: ModeType) => void;
      }
  )
) {
  return (
    <Center
      //*需要将h改为minH，否则header部分高度会被下方内容压窄
      minH={"2em"}
      px={3}
      bg={props.position === "m" ? "cyan.700" : "teal.500"}
    >
      <Heading
        as="h4"
        size={"md"}
        whiteSpace={"nowrap"}
        color="white"
        borderBottom={"white 1px solid"}
      >
        {props.title}
      </Heading>
      {props.position === "m" && (
        <ButtonGroup
          // size="sm"
          isAttached
          variant="outline"
          opacity={0.7}
          ml={5}
        >
          <IconButton
            aria-label="single mode"
            maxH={"1.5em"}
            isActive={props.mode === "single"}
            icon={<IconStop />}
            onClick={() => {
              if (props.mode !== "single") props.changeMode("single");
            }}
          />
          <IconButton
            aria-label="grid mode"
            maxH={"1.5em"}
            isActive={props.mode === "grid"}
            icon={<IconGridView />}
            onClick={() => {
              if (props.mode !== "grid") props.changeMode("grid");
            }}
          />
        </ButtonGroup>
      )}
    </Center>
  );
}

function App() {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [reload, setReload] = useState(true);

  const fileStore = useFileStore();
  const countStore = useCountStore();
  const toast = useToast();
  const [selectedDir, setSelected] = useState<DirType | null>(null);
  const [rtSample, setRtSample] = useState<string | null>(null); //实时样本图片
  const [displayMode, setMode] = useState<ModeType>("single");

  //上传图片文件到 store 中
  function handleUpload(imgs: string[]) {
    fileStore.addDir({
      dName: "ImgGroup " + countStore.increment(),
      imgs: imgs,
    });
    toast({
      title: "Imgs imported!",
      description: "The group of images are imported successfully.",
      status: "success",
      variant: "subtle",
      duration: 2000,
      position: "top",
      isClosable: true,
    });
  }

  //删除一个图像组
  function handleDelete(id: string) {
    fileStore.deleteDir(id);
    toast({
      title: "Imgs Deleted!",
      description: "The group of images are deleted successfully.",
      status: "success",
      variant: "subtle",
      duration: 2000,
      position: "top",
      isClosable: true,
    });
  }

  //添加实时样本图
  const addSample = ({ file }: { file: FileItem }) => {
    //@ts-expect-error File extends Blob
    const url = URL.createObjectURL(file.fileInstance);
    setRtSample(url);
  };

  return (
    <>
      <Box className="main" bgColor={"gray.700"}>
        <div className="app-header">
          <div className="app-logo">
            <Heading as={"h6"} textColor={"gray.400"} ml={2}>
              Images Viewer
            </Heading>
          </div>
        </div>
        <Flex m={"0.5em"} flexGrow={1} gap={2} minH={0}>
          <Flex direction={"column"} {...boxCfg}>
            <BoxHeader title="Image Groups" position="l" />
            <VStack
              w={280}
              alignItems={"center"}
              py={4}
              overflowY={"auto"}
              spacing={4}
            >
              {fileStore.dirs.map((dir) => {
                return (
                  <ImgDir
                    key={dir.id}
                    id={dir.id}
                    dName={dir.dName}
                    type="img"
                    cover={dir.imgs[0]}
                    imgNum={dir.imgs.length}
                    isSelected={
                      selectedDir !== null && dir.id === selectedDir.id
                    }
                    onSelect={() => {
                      setSelected({ ...dir });
                    }}
                    onDelete={() => handleDelete(dir.id)}
                    onEditDName={(newName) => {
                      fileStore.editDName(dir.id, newName);
                    }}
                  />
                );
              })}

              <ImgDir type="add" onUpload={(imgs) => handleUpload(imgs)} />
            </VStack>
          </Flex>
          <Flex
            flexGrow={1}
            // flexShrink={0}
            direction={"column"}
            {...boxCfg}
          >
            <BoxHeader
              title="Image Display Area"
              position="m"
              mode={displayMode}
              changeMode={(mode) => setMode(mode)}
            />
            {/* TODO: 未来可以支持四格布局*/}
            <HStack
              w={"100%"}
              h={"calc(100% - 2em)"}
              justifyContent={"center"}
              alignItems={"center"}
              fontFamily={"Arial"}
            >
              {selectedDir === null ? (
                <Empty
                  image={
                    <IllustrationNoContent
                      style={{ width: 150, height: 150 }}
                    />
                  }
                  darkModeImage={
                    <IllustrationNoContentDark
                      style={{ width: 150, height: 150 }}
                    />
                  }
                  description={<Text color={"gray.300"}> No Images Yet</Text>}
                />
              ) : (
                <ImgWindow
                  {...selectedDir}
                  zoomLevel={zoomLevel}
                  reload={reload}
                />
              )}
            </HStack>
          </Flex>
          <Flex direction={"column"} {...boxCfg}>
            <BoxHeader title="Tools" position="r" />
            <Grid
              templateColumns={"repeat(3, 1fr)"}
              justifyItems={"center"}
              gap={2}
              minW={200}
              my={8}
              mx={5}
            >
              <GridItem colSpan={2}>
                <ZoomControl
                  zoomLevel={zoomLevel}
                  setZoomLevel={setZoomLevel}
                />
              </GridItem>
              <Reload reload={reload} setReload={setReload} />
              <Tag />
              <Edit />
              <Measure />
            </Grid>
            <Divider />
            <VStack>
              <Center bg={"whiteAlpha.400"} w={"100%"} minH={"2em"}>
                <Heading
                  as="h4"
                  size={"md"}
                  whiteSpace={"nowrap"}
                  color="white"
                >
                  {"Real-time Sample"}
                </Heading>
              </Center>

              <AspectRatio width={200} ratio={4 / 3} mt={5}>
                {rtSample === null ? (
                  <Upload
                    action=""
                    accept="image/*"
                    showUploadList={false}
                    customRequest={addSample}
                  >
                    <AspectRatio width={200} ratio={4 / 3}>
                      <Flex
                        justifyContent={"center"}
                        borderWidth={2}
                        borderRadius={"md"}
                        borderColor={"gray.600"}
                        bgColor={"blackAlpha.500"}
                      >
                        <IconCamera
                          size="extra-large"
                          style={{ color: "#718096" }}
                        />
                      </Flex>
                    </AspectRatio>
                  </Upload>
                ) : (
                  <Box
                    borderRadius={"md"}
                    // borderWidth={2}
                    borderColor={"gray.600"}
                    bgColor={"blackAlpha.500"}
                  >
                    <Image
                      imgStyle={{
                        width: "200px",
                        height: "calc(150px - 8px)",
                        objectFit: "contain",
                      }}
                      src={rtSample}
                    />
                  </Box>
                )}
              </AspectRatio>
            </VStack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}

export default App;
