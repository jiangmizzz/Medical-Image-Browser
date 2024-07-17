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
import Drag from "./components/Drag";

const imgPrefix = "http://localhost:8080/"; //显示图片的url
const boxCfg = {
  borderWidth: "1px",
  rounded: "md",
  boxShadow: "base",
  overflow: "hidden",
  fontFamily: "Arial",
  borderColor: "#3a409a",
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
      bg={props.position === "m" ? "#041c4a" : "#051c4a"}
    >
      <Heading
        as="h4"
        size={"md"}
        whiteSpace={"nowrap"}
        color="#8dcaf1"
        borderBottom={"#8dcaf1 1px solid"}
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
            color={"#5acbe6"}
            aria-label="single mode"
            maxH={"1.5em"}
            isActive={props.mode === "single"}
            icon={<IconStop />}
            borderColor={"#3a3f99"}
            _active={{ backgroundColor: "#0844b2" }}
            onClick={() => {
              if (props.mode !== "single") props.changeMode("single");
            }}
          />
          <IconButton
            color={"#5acbe6"}
            aria-label="grid mode"
            maxH={"1.5em"}
            isActive={props.mode === "grid"}
            icon={<IconGridView />}
            borderColor={"#3a3f99"}
            _active={{ backgroundColor: "#0844b2" }}
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
  const [measure, setMeasure] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [drag, setDrag] = useState<boolean>(true);

  useEffect(() => {
    // 创建 eventsource 实例
    const source = new EventSource("http://localhost:8080/listen");
    const regex = /\/public\/[^ ]*/g; //有效路径为/public/...部分
    // 监听开启时的回调函数
    source.onopen = function () {
      console.log("Connection to server opened.");
    };
    // 监听 'message' 事件
    source.onmessage = async function (event) {
      const eventData: ESData = JSON.parse(event.data);
      const pathMatch = eventData.dirPath.match(regex);
      console.log(eventData);
      if (pathMatch && pathMatch.length > 0) {
        const path = pathMatch[pathMatch.length - 1].replace(/^\/public\//, ""); //以 /public 开头的有效文件路径，再去掉/public/
        // console.log(path);
        if (
          countStore.lastEvent.event === eventData.event &&
          countStore.lastEvent.dirPath === eventData.dirPath
        ) {
          //重复发送消息
        }
        if (eventData.event === "addDir") {
          //添加文件夹,分为父文件夹，后子文件夹
          if (path.includes("/")) {
            //存在父文件夹
            const father = path.slice(0, path.indexOf("/")); //提取父文件夹名
            fileStore.addDir({ dName: path, fatherDName: father, imgs: [] });
          } else {
            //无父文件夹
            fileStore.addDir({
              dName: path,
              fatherDName: path,
              imgs: [],
            });
          }

          // fileStore.addDir({dName: filePath})
        } else if (eventData.event === "add") {
          // 往文件夹里添加文件，一般在 addDir 之后，按生成顺序添加
          // 从 path 中获取 dName
          let id = "";
          let dName = path;
          const firstSlashIndex = path.indexOf("/");
          const secondSlashIndex = path.indexOf("/", firstSlashIndex + 1);

          if (firstSlashIndex === -1) {
            dName = "";
          } else if (secondSlashIndex === -1) {
            dName = path.substring(0, firstSlashIndex); // 只有一个 / 时，取 / 前面的部分
          } else {
            dName = path.substring(0, secondSlashIndex); // 有两个 / 时，取两者之间的部分
          }
          if (dName === "") {
            //实时样本图片
            const img = await fetch(imgPrefix + path);
            const blob = await img.blob();
            // 创建 Blob URL
            const blobUrl = URL.createObjectURL(blob);
            setRtSample(blobUrl);
          } else {
            //需要展示的图片
            // 通过dName寻找id
            for (const [key, val] of fileStore.dirMap.entries()) {
              if (val === dName) {
                id = key;
              }
            }
            const imgUrlStart = eventData.dirPath.lastIndexOf("/");
            const imgName = eventData.dirPath.slice(imgUrlStart + 1);
            // 根据文件名中所含信息分配 order
            const orderRegex = /=(\d+)\./; //图片名称的格式
            const match = imgName.match(orderRegex);
            if (match && match.length != 0) {
              const order: number = parseInt(match[1], 10);
              // 将响应体转换为 Blob 对象
              const img = await fetch(imgPrefix + path);
              const blob = await img.blob();
              // 创建 Blob URL
              const blobUrl = URL.createObjectURL(blob);
              console.log("blob:", blobUrl);
              fileStore.appendDir(id, {
                order: order,
                url: blobUrl,
              });
            } else {
              const id = "single-toast-1";
              if (!toast.isActive(id)) {
                toast({
                  id,
                  //限制最大显示 toast 数量
                  title: "Imgs imported!",
                  description: `The names of the images are not follow the rule: ${orderRegex}`,
                  status: "warning",
                  variant: "subtle",
                  duration: 2000,
                  position: "top",
                  isClosable: true,
                });
              }
            }
          }
        }
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
  }, []);

  //上传图片文件到 store 中
  function handleUpload(imgs: ImgObj[]) {
    const cnt = countStore.increment();
    fileStore.addDir({
      dName: "ImgGroup " + cnt,
      fatherDName: "ImgGroup " + cnt,
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

  useEffect(() => {
    if (edit === true && drag === true) {
      setDrag(false);
    } else if (edit === false && drag === false) {
      setDrag(true);
    }
  }, [edit]);

  useEffect(() => {
    if (edit === true && drag === true) {
      setEdit(false);
    } else if (edit === false && drag === false) {
      setEdit(true);
    }
  }, [drag]);

  useEffect(() => {
    setEdit(false);
    setDrag(true);
  }, [reload]);

  return (
    <>
      <Box className="main" bgColor={"black"}>
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
              {/* //所有文件夹均以相等方式存放，但在列表渲染时过滤图片数为0的文件夹 */}
              {fileStore.dirs
                .filter((dir) => dir.imgs.length > 0)
                .map((dir) => {
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
              changeMode={(mode) => {
                if (mode === "grid") {
                  if (!selectedDir) {
                    toast({
                      title: "Can not display in grid form!",
                      description: `No selected directory!`,
                      status: "warning",
                      variant: "subtle",
                      duration: 2000,
                      position: "top",
                      isClosable: true,
                    });
                  } else if (selectedDir.dName === selectedDir.fatherDName) {
                    toast({
                      title: "Can not display in grid form!",
                      description: `The directory has no father directory!`,
                      status: "warning",
                      variant: "subtle",
                      duration: 2000,
                      position: "top",
                      isClosable: true,
                    });
                  } else {
                    setMode(mode);
                  }
                } else {
                  setMode(mode);
                }
              }}
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
                  displayMode={displayMode}
                  zoomLevel={zoomLevel}
                  reload={reload}
                  setZoomLevel={setZoomLevel}
                  measure={measure}
                  edit={edit}
                  drag={drag}
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
              <Reload
                reload={reload}
                setReload={setReload}
                setZoom={setZoomLevel}
              />
              <Measure m={measure} setM={setMeasure} />
              <Drag drag={drag} setDrag={setDrag} />
              <Edit edit={edit} setEdit={setEdit} />
            </Grid>
            <Divider />
            <VStack>
              <Center bg={"#041c4a"} w={"100%"} minH={"2em"}>
                <Heading
                  as="h4"
                  size={"md"}
                  whiteSpace={"nowrap"}
                  color="#90cdf4"
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
