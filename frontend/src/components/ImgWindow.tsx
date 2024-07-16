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
import RulerComponent from "./Ruler";
// import MeasureComponent from "./MeasureComponent";
import { ImgObj } from "../vite-env";
import MeasureComponent from "./MeasureComponent";

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
  imgs: ImgObj[];
  zoomLevel: number;
  reload: boolean;
  setZoomLevel: (zoom: number) => void;
  measure: boolean;
  edit: boolean;
  drag: boolean;
}

interface CropData {
  x: number;
  y: number;
  height: number;
  width: number;
}

interface ImageData {
  top: number;
  left: number;
  width: number;
  height: number;
  naturalWidth: number;
  naturalHeight: number;
}

interface CanvasData {
  top: number;
  left: number;
  width: number;
  height: number;
  naturalWidth: number;
  naturalHeight: number;
}

export default function ImgWindow(props: ImgWindowProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [lastZoomLevel, setLastZoomLevel] = useState<number>(1);
  const [cropperInstance, setCropperInstance] = useState<Cropper | null>(null);
  const [cropData, setCropData] = useState<CropData | null>(null);
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [canvasData, setCanvasData] = useState<CanvasData | null>(null);
  const [page, setPage] = useState(1);
  const [scale, setScale] = useState(1);
  const [measure, setMeasure] = useState(false);
  useEffect(() => {
    setPage(1);
    setCropData(null);
  }, [props.id]);

  useEffect(() => {
    setPage(page);
    setCropData(null);
  }, [props.reload]);

  useEffect(() => {
    setMeasure(props.measure);
  }, [props.measure]);

  useEffect(() => {
    if (cropperInstance) {
      if (props.edit === true) {
        cropperInstance.setDragMode("none");
      } else if (props.drag === true) {
        cropperInstance.setDragMode("move");
      }
    }
  }, [props.drag, props.edit]);

  useEffect(() => {
    if (imageRef.current) {
      const newCropper = new Cropper(imageRef.current, {
        aspectRatio: NaN,
        dragMode: "move",
        cropBoxMovable: true,
        modal: false,
        guides: false,
        highlight: true,
        zoomOnWheel: false,
        background: false,
        center: false,
        autoCrop: false,
        autoCropArea: 1,
        viewMode: 0,
        crop: () => {
          const cropD = newCropper.getData();
          const data = newCropper.getCropBoxData();
          setCropData({
            height: cropD.height,
            width: cropD.width,
            x: data.left,
            y: data.top,
          });
          // setScale(cropD.width / data.width);
          const imageD = newCropper.getImageData();
          setScale(imageD.naturalWidth / imageD.width);
        },
        ready: () => {
          const imageD = newCropper.getImageData();
          const canvasD = newCropper.getCanvasData();
          setScale(imageD.naturalWidth / imageD.width);
          setImageData({
            top: imageD.top,
            left: imageD.height,
            width: imageD.width,
            height: imageD.height,
            naturalWidth: imageD.naturalWidth,
            naturalHeight: imageD.naturalHeight,
          });
          setCanvasData({
            top: canvasD.top,
            left: canvasD.height,
            width: canvasD.width,
            height: canvasD.height,
            naturalWidth: canvasD.naturalWidth,
            naturalHeight: canvasD.naturalHeight,
          });
          // console.log(imageD, canvasD);
        },
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
      // overflowY={"auto"}
      // overflowX={"hidden"}
    >
      <Box
        position={"relative"}
        zIndex={10}
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
        <Text as={"b"} color={"whiteAlpha.700"}>
          {props.dName}
        </Text>
      </Box>
      <Box
        position={"relative"}
        zIndex={10}
        alignSelf={"start"}
        borderRadius={"md"}
        bgColor={"blackAlpha.300"}
        h={8}
        mb={-8}
        marginTop={10}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        px={2}
      >
        <Text as={"b"} color={"whiteAlpha.700"}>
          Zoom rate: {props.zoomLevel}
        </Text>
      </Box>

      <Box w={"80%"} h={"80%"}>
        <Image
          minH={0}
          objectFit={"contain"}
          src={props.imgs[page - 1].url}
          ref={imageRef}
          alt="Cropper"
          position={"relative"}
          zIndex={5}
          // style={{
          //   display: "none",
          // }}
        />
        {imageData?.naturalWidth === imageData?.naturalHeight &&
          cropData !== null &&
          cropData.width !== 0 &&
          cropData.height !== 0 && (
            <Text
              position="absolute"
              top={`${cropData.y + 130}px`}
              left={`${cropData.x + 405}px`}
              color="white"
              bg="black"
              fontSize="12px"
              padding="2"
              borderRadius="5px"
              zIndex={10}
            >
              width: {((cropData.width * 16) / 808).toFixed(2)}mm, height:{" "}
              {((cropData.height * 16) / 808).toFixed(2)}mm
            </Text>
          )}
        {imageData?.naturalWidth !== imageData?.naturalHeight &&
          cropData !== null &&
          cropData.width !== 0 &&
          cropData.height !== 0 && (
            <Text
              position="absolute"
              top={`${cropData.y + 130}px`}
              left={`${cropData.x + 405}px`}
              color="white"
              bg="black"
              fontSize="12px"
              padding="2"
              borderRadius="5px"
              zIndex={10}
            >
              width: {((cropData.width * 16) / 808).toFixed(2)}mm, height:{" "}
              {((cropData.height * 3.55) / 1024).toFixed(2)}mm
            </Text>
          )}
        {props.edit === true && imageData !== null && canvasData !== null && (
          <MeasureComponent
            imageData={imageData}
            canvasData={canvasData}
            scale={scale}
          />
        )}
      </Box>
      {measure === true && (
        <Box
          position={"relative"}
          zIndex={10}
          alignSelf={"start"}
          borderRadius={"md"}
          bgColor={"blackAlpha.300"}
          h={8}
          mb={-8}
          marginTop={10}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"start"}
          px={2}
        >
          <Text as={"b"} color={"whiteAlpha.700"} marginTop={2}>
            <RulerComponent zoomLevel={1 / scale} />
          </Text>
        </Box>
      )}

      <Flex
        flex={1}
        w={"100%"}
        justify={"center"}
        align={"end"}
        position={"relative"}
        zIndex={10}
      >
        {/* <Tag justifySelf={"start"}>{props.dName}</Tag> */}
        <Slider
          aria-label="page-slider"
          w={"50%"}
          min={1}
          max={props.imgs.length}
          value={page}
          mb={2}
          onChange={(val) => {
            setPage(val);
            props.setZoomLevel(1);
            setCropData(null);
          }}
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
