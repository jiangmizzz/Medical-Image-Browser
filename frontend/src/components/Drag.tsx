import { DragOutlined } from "@ant-design/icons";
import { Box, IconButton } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icons";

interface DragProps {
  drag: boolean;
  setDrag: (drag: boolean) => void;
}

const Drag: React.FC<DragProps> = ({ drag, setDrag }) => {
  return drag === false ? (
    <Box>
      <IconButton
        aria-label="Edit"
        icon={<Icon as={DragOutlined} />}
        colorScheme="teal"
        marginTop="8px"
        onClick={() => setDrag(!drag)}
        variant={"outline"}
      />
    </Box>
  ) : (
    <Box>
      <IconButton
        aria-label="Edit"
        icon={<Icon as={DragOutlined} />}
        colorScheme="teal"
        marginTop="8px"
        onClick={() => setDrag(!drag)}
      />
    </Box>
  );
};

export default Drag;
