// import { useState } from "react";
import "./App.css";
import "./assets/reset.css";
import { Box, Center, Flex, Heading, VStack, HStack, Text } from "@chakra-ui/react";
import { useState } from "react";

import ZoomControl from "./components/ZoomControl";
import Scroll from "./components/Scroll";
import Tag from "./components/Tag";
import Edit from "./components/Edit";
import Reload from "./components/Reload";
import Measure from "./components/Measure";
import CropperComponent from "./components/Cropper";
import ImgDir from "./components/ImgDir";
import { useFileStore } from "./stores/filesStore";
import { useCountStore } from "./stores/countStore";
import { useToast } from "@chakra-ui/react";
import { DirType } from "./vite-env";
import ImgWindow from "./components/ImgWindow";
import { Empty } from "@douyinfe/semi-ui";
import {
  IllustrationNoContent,
  IllustrationNoContentDark,
} from "@douyinfe/semi-illustrations";

const boxCfg = {
  borderWidth: "1px",
  rounded: "md",
  boxShadow: "base",
  overflow: "hidden",
  fontFamily: "Arial",
};

function BoxHeader(props: { title: string; position: "l" | "m" | "r" }) {
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
    </Center>
  );
}

function App() {
  const [zoomLevel, setZoomLevel] = useState(1);
  const handleCrop = (croppedArea: { x: number; y: number; width: number; height: number }) => {
    // 以后要加的操作
  };

  const fileStore = useFileStore();
  const countStore = useCountStore();
  const toast = useToast();
  const [selectedDir, setSelected] = useState<DirType | null>(null);

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
            <BoxHeader title="Image Display Area" position="m" />
            {/* TODO: 未来可以支持多种布局，如并列、网格... */}
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
                <ImgWindow {...selectedDir} />
              )}
            </HStack>
            <CropperComponent 
              zoomLevel={zoomLevel}
              dir={selectedDir}
              aspectRatio={1}
              onCrop={handleCrop} 
            />
          </Flex>
          <Flex direction={"column"} {...boxCfg}>
            <BoxHeader title="Tools" position="r" />
            <VStack>
              <div>
                <ZoomControl zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} />
                <Scroll />
                <Tag />
                <Edit />
                <Reload />
                <Measure />
              </div>
            </VStack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}

export default App;
