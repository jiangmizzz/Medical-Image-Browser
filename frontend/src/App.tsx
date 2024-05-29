// import { useState } from "react";
import "./App.css";
import "./assets/reset.css";
import { Box, Center, Flex, Heading, VStack } from "@chakra-ui/react";
import { useState } from "react";

import ZoomControl from "./components/ZoomControl";
import ImageDisplay from "./components/ImageDisplay";
import Move from "./components/Drag";
import Scroll from "./components/Scroll";
import Tag from "./components/Tag";
import Edit from "./components/Edit";
import Reload from "./components/Reload";
import Measure from "./components/Measure";
import CropperComponent from "./components/Cropper";

const boxCfg = {
  borderWidth: "1px",
  rounded: "md",
  boxShadow: "base",
  overflow: "hidden",
  fontFamily: "Times New Roman",
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
    console.log('Cropped area:', croppedArea);
    // 其他处理，看您干嘛x
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
            <VStack minW={280}>
              <div></div>
            </VStack>
          </Flex>
          <Flex
            flexGrow={1}
            // flexShrink={0}
            direction={"column"}
            {...boxCfg}
          >
            <BoxHeader title="Image Display Area" position="m" />
            <CropperComponent 
              src="../../img/zju.png"
              aspectRatio={1}
              onCrop={handleCrop} 
            />
          </Flex>
          <Flex direction={"column"} {...boxCfg}>
            <BoxHeader title="Tools" position="r" />
            <VStack>
              <div>
                <ZoomControl zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} />
                <Move />
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
