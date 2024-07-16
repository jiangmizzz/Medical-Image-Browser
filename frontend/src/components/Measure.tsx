import { MenuOutlined } from "@ant-design/icons";
import { Box, IconButton } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icons";

interface MeasureProps {
  m: boolean;
  setM: (m: boolean) => void;
}

const Measure: React.FC<MeasureProps> = ({ m, setM }) => {
  return m === true ? (
    <Box>
      <IconButton
        aria-label="Measure"
        onClick={() => {
          setM(!m);
        }}
        icon={<Icon as={MenuOutlined} />}
        colorScheme="teal"
        marginTop="8px"
      />
    </Box>
  ) : (
    <Box>
      <IconButton
        aria-label="Measure"
        onClick={() => {
          setM(!m);
        }}
        icon={<Icon as={MenuOutlined} />}
        colorScheme="teal"
        marginTop="8px"
        variant={"outline"}
      />
    </Box>
  );
};

export default Measure;
