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
import { useEffect, useState } from "react";

import ZoomControl from "./components/ZoomControl";
import Tag from "./components/Tag";
import Edit from "./components/Edit";
import Reload from "./components/Reload";
import Measure from "./components/Measure";
import ImgDir from "./components/ImgDir";
import { useFileStore } from "./stores/filesStore";
import { useCountStore } from "./stores/countStore";
import { useToast } from "@chakra-ui/react";
import { DirType, ESData, ImgObj } from "./vite-env";
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

  useEffect(() => {
    // 创建 eventsource 实例
    const source = new EventSource("http://localhost:8080/listen");
    const regex = /\/public\/[^ ]*/g; //有效路径为/public/...部分
    // 监听开启时的回调函数
    source.onopen = function () {
      console.log("Connection to server opened.");
    };
    // 监听 'message' 事件
    source.onmessage = function (event) {
      const eventData: ESData = JSON.parse(event.data);
      const pathMatch = eventData.dirPath.match(regex);
      console.log(eventData);
      if (eventData.event === "addDir") {
        //添加文件夹,分为父文件夹，后子文件夹
        //TODO:所有文件夹均以相等方式存放，但在列表渲染时过滤图片数为0的文件夹
        if (pathMatch && pathMatch.length > 0) {
          const path = pathMatch[pathMatch.length - 1].replace(
            /^\/public\//,
            ""
          ); //以 /public 开头的有效文件路径，再去掉/public/
          if (path.includes("/")) {
            //存在父文件夹
            const father = path.slice(0, path.indexOf("/")); //提取父文件夹名
            fileStore.addDir({ dName: path, fatherDName: father, imgs: [] });
          } else {
            //无父文件夹
            fileStore.addDir({ dName: path, fatherDName: path, imgs: [] });
          }
        }
        // fileStore.addDir({dName: filePath})
      } else if (eventData.event === "add") {
        //TODO:往文件夹里添加文件，一般在 addDir 之后，按生成顺序添加
        const id = "tempId"; //TODO: 通过dName寻找id
        const imgUrlStart = eventData.dirPath.lastIndexOf("/");
        const imgUrl = eventData.dirPath.slice(imgUrlStart + 1);
        fileStore.appendDir(id, { order: 0, url: imgUrl }); //TODO:分配 order
      }
    };
    // 监听 'error' 事件
    source.onerror = function (event) {
      if (event.eventPhase === EventSource.CLOSED) {
        console.log("Connection to server closed.");
      } else {
        console.error("Error occurred:", event);
      }
    };
  }, [fileStore]);

  //上传图片文件到 store 中
  function handleUpload(imgs: ImgObj[]) {
    fileStore.addDir({
      dName: "ImgGroup " + countStore.increment(),
      fatherDName: "ImgGroup " + countStore.increment(),
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
                    fatherDName={dir.fatherDName}
                    type="img"
                    cover={dir.imgs[0].url}
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
