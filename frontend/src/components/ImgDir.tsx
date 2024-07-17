import { AddIcon, CheckIcon, EditIcon } from "@chakra-ui/icons";
import { DirType, ImgObj } from "../vite-env";
import {
  AspectRatio,
  Badge,
  Button,
  Flex,
  HStack,
  Image,
  Input,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { CloseButton } from "@chakra-ui/react";
import { Upload } from "@douyinfe/semi-ui";
import type { FileItem } from "@douyinfe/semi-ui/lib/es/upload";
import { useState } from "react";
import { ImagePreview } from "@douyinfe/semi-ui";

interface ImgDirProps extends Omit<DirType, "imgs"> {
  type: "img";
  cover: string; //封面的图片url
  imgNum: number; //共有多少张图片
  isSelected: boolean; //是否被选中
  onSelect: () => void; //选中展示当前图片组
  onDelete: () => void; //删除当前图片组
  onEditDName: (newName: string) => void; //修改图片组名称
}

interface AddProps {
  type: "add";
  onUpload: (imgs: ImgObj[]) => void;
}

export default function ImgDir(props: ImgDirProps | AddProps) {
  const toast = useToast();
  const [showClose, setShowClose] = useState<boolean>(false);
  const [imgArray, setImgArray] = useState<ImgObj[]>([]); //图片列表
  const [isPreview, setPreview] = useState<boolean>(false);
  const [isEdit, setEdit] = useState<boolean>(false);
  const [dName, setDName] = useState<string>(
    props.type === "img" ? props.dName : ""
  );

  // 依次处理上传的图片文件，基于文件名排序
  const handleUpload = ({ file }: { file: FileItem }) => {
    const regex = /=(\d+)\./;
    const match = file.name.match(regex);
    if (match && match.length != 0) {
      const order: number = parseInt(match[1], 10);
      setImgArray((prevImgs) => {
        return [...prevImgs, { order: order, url: file.url! }];
      });
    } else {
      const id = "single-toast";
      if (!toast.isActive(id)) {
        toast({
          id,
          //限制最大显示 toast 数量
          title: "Imgs imported!",
          description: `The names of the images are not follow the rule: ${regex}`,
          status: "warning",
          variant: "subtle",
          duration: 2000,
          position: "top",
          isClosable: true,
        });
      }
    }
  };

  // 添加文件夹
  function handleAdd() {
    if (props.type === "add") {
      const sortedImgs = imgArray.sort((a, b) => {
        if (a.order < b.order) {
          return -1;
        }
        if (a.order > b.order) {
          return 1;
        }
        return 0;
      });
      //转化成 string[]
      props.onUpload(sortedImgs);
      setImgArray([]);
    }
  }

  if (props.type === "img")
    return (
      <Flex
        flexDirection={"column"}
        p={3}
        borderWidth={props.isSelected ? 2 : 1}
        borderRadius={"md"}
        borderColor={props.isSelected ? "#5acbe6" : "#3a3f99"}
        bgColor={"blackAlpha.400"}
        rowGap={1}
        cursor={"pointer"}
        _hover={{
          borderColor: props.isSelected ? "#5acbe6" : "#90cdf4",
          bgColor: "blackAlpha.500",
        }}
        onClick={() => props.onSelect()}
        onMouseEnter={() => setShowClose(true)}
        onMouseLeave={() => setShowClose(false)}
      >
        {showClose && (
          <CloseButton
            color={"white"}
            bgColor={"gray.600"}
            rounded={"full"}
            size={"sm"}
            ml={-6}
            mt={-7}
            opacity={0.6}
            onClick={(e) => {
              e.stopPropagation();
              props.onDelete();
            }}
          />
        )}
        <Flex flexDirection={"row"} alignItems={"end"} fontFamily={"Arial"}>
          <AspectRatio
            width={210}
            ratio={4 / 3}
            borderRadius={"sm"}
            overflow={"hidden"}
          >
            <Image objectFit={"cover"} src={props.cover} />
          </AspectRatio>
          <Badge
            colorScheme="green"
            position={"relative"}
            ml={-7}
            w={7}
            textAlign={"center"}
          >
            {props.imgNum}
          </Badge>
        </Flex>
        <Flex gap={3} alignItems={"center"}>
          {isEdit ? (
            <Input
              size={"sm"}
              fontSize={"md"}
              fontWeight={"bold"}
              textColor={"white"}
              maxWidth={180}
              autoFocus
              value={dName}
              onClick={(e) => {
                e.stopPropagation();
              }}
              onChange={(e) => {
                setDName(e.target.value);
              }}
            />
          ) : (
            <Text
              as={"b"}
              fontSize="md"
              color={"white"}
              maxWidth={180}
              overflow={"hidden"}
              whiteSpace={"nowrap"}
              textOverflow={"ellipsis"}
            >
              {props.dName}
            </Text>
          )}
          {isEdit ? (
            <CheckIcon
              color={"gray.500"}
              onClick={(e) => {
                e.stopPropagation();
                props.onEditDName(dName);
                setEdit(false);
              }}
            />
          ) : (
            <EditIcon
              color={"gray.500"}
              onClick={(e) => {
                e.stopPropagation();
                setEdit(true);
              }}
            />
          )}
        </Flex>
      </Flex>
    );
  else
    return (
      <Flex
        borderWidth={2}
        borderRadius={"md"}
        borderColor={"gray.600"}
        borderStyle={"dashed"}
        bgColor={"blackAlpha.400"}
        columnGap={1}
        cursor={"pointer"}
        _hover={{ borderColor: "gray.300", bgColor: "blackAlpha.500" }}
      >
        <Upload
          action=""
          accept="image/*"
          showUploadList={false}
          directory={true}
          customRequest={handleUpload}
          disabled={imgArray.length !== 0}
        >
          <AspectRatio width={210} p={3} boxSizing="content-box" ratio={4 / 3}>
            <Flex justifyContent={"center"}>
              {imgArray.length === 0 ? (
                <AddIcon boxSize={8} color={"gray.500"} />
              ) : (
                <HStack onClick={(e) => e.stopPropagation()}>
                  <VStack>
                    <ImagePreview
                      src={imgArray.map((file) => file.url)}
                      visible={isPreview}
                      onVisibleChange={(v) => setPreview(v)}
                    >
                      <Image
                        w={100}
                        h={100}
                        objectFit={"contain"}
                        src={imgArray[0].url}
                        onClick={() => setPreview(true)}
                      />
                    </ImagePreview>
                  </VStack>

                  <VStack spacing={2}>
                    <Button
                      colorScheme="teal"
                      size={"sm"}
                      onClick={handleAdd} //确认上传
                    >
                      确定
                    </Button>
                    <Button
                      colorScheme="teal"
                      size={"sm"}
                      onClick={() => setImgArray([])} //清空图片列表
                    >
                      取消
                    </Button>
                  </VStack>
                </HStack>
              )}
            </Flex>
          </AspectRatio>
        </Upload>
      </Flex>
    );
}
