import { Box, Flex, Image, Text } from "@chakra-ui/react";
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

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
}

export default function ImgWindow(props: ImgWindowProps) {
  const [page, setPage] = useState(1);
  useEffect(() => {
    setPage(1);
  }, [props.id]);

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
