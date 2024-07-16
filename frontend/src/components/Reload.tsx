import { ReloadOutlined } from "@ant-design/icons";
import { Box, IconButton } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icons";

interface ReloadProps {
  reload: boolean;
  setReload: (reload: boolean) => void;
  setZoom: (zoom: number) => void;
}

const Reload: React.FC<ReloadProps> = ({ reload, setReload, setZoom }) => {
  return (
    <Box>
      <IconButton
        aria-label="Reload"
        onClick={() => {
          setReload(!reload);
          setZoom(1);
        }}
        icon={<Icon as={ReloadOutlined} />}
        colorScheme="teal"
        variant="outline"
      />
    </Box>
  );
};

export default Reload;
