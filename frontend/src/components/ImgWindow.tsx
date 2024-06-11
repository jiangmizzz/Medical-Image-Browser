import { Box, Flex, Image, Text } from "@chakra-ui/react";
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";

//预设颜色
///* TODO: 未来可以支持多种布局，如并列、网格... 相应改样式并分配不同的框色*/
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const colors = [
  "#dbbe9a",
  "#7292ac",
  "#b67681",
  "#83a89a",
  "#d48d84",
  "#a8b0bf",
  "cyan.800",
];
interface ImgWindowProps {
  id: string;
  dName: string;
  imgs: string[];
  zoomLevel: number;
  reload: boolean;
}

export default function ImgWindow(props: ImgWindowProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [lastZoomLevel, setLastZoomLevel] = useState<number>(1);
  const [cropperInstance, setCropperInstance] = useState<Cropper | null>(null);

  const [page, setPage] = useState(1);
  useEffect(() => {
    setPage(1);
  }, [props.id, props.reload]);

  useEffect(() => {
    if (imageRef.current) {
      const newCropper = new Cropper(imageRef.current, {
        aspectRatio: 1,
        dragMode: "move",
        cropBoxMovable: false,
        modal: false,
        guides: false,
        highlight: false,
        background: false,
        center: false,
        autoCrop: false,
        autoCropArea: 1,
        viewMode: 0,
      });

      setCropperInstance(newCropper);
      setLastZoomLevel(props.zoomLevel);

      return () => {
        if (newCropper) {
          newCropper.destroy();
          setCropperInstance(null);
        }
      };
    }
  }, [page, props.id, props.reload]);

  useEffect(() => {
    if (cropperInstance && props.zoomLevel !== undefined) {
      cropperInstance.zoom(props.zoomLevel - lastZoomLevel);
      setLastZoomLevel(props.zoomLevel);
    }
  }, [props.zoomLevel]);

  return (
    <Flex
      flexDirection={"column"}
      p={3}
      borderWidth={2}
      borderStyle={"dashed"}
      borderRadius={"md"}
      borderColor={"cyan.800"}
      bgColor={"blackAlpha.400"}
      w={"90%"}
      h={"90%"}
      columnGap={3}
      alignItems={"center"}
      overflowY={"auto"}
      overflowX={"hidden"}
    >
      <Box
        position={"relative"}
        alignSelf={"start"}
        borderRadius={"md"}
        bgColor={"blackAlpha.300"}
        h={8}
        mb={-8}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        px={2}
      >
        <Text as={"b"} color={"whiteAlpha.700"} ml={2}>
          {props.dName}
        </Text>
      </Box>

      <Image
        w={"100%"}
        h={"90%"}
        minH={0}
        objectFit={"contain"}
        src={props.imgs[page - 1]}
        ref={imageRef}
        alt="Cropper"
        style={{
          display: "none",
        }}
      />
      <Flex flex={1} w={"100%"} justify={"center"} align={"end"}>
        {/* <Tag justifySelf={"start"}>{props.dName}</Tag> */}
        <Slider
          aria-label="page-slider"
          w={"50%"}
          min={1}
          max={props.imgs.length}
          value={page}
          mb={2}
          onChange={(val) => setPage(val)}
        >
          <SliderMark
            value={page}
            textAlign="center"
            bg="blue.500"
            color="white"
            mt="-10"
            ml="-7"
            px={3}
            borderRadius={"sm"}
          >
            {page + "/" + props.imgs.length}
          </SliderMark>
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </Flex>
    </Flex>
  );
}
