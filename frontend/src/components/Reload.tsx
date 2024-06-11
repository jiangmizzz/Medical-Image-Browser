import { ReloadOutlined } from "@ant-design/icons";
import { Box, IconButton } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icons";

interface ReloadProps {
  reload: boolean;
  setReload: (reload: boolean) => void;
}

const Reload: React.FC<ReloadProps> = ({ reload, setReload }) => {
  return (
    <Box>
      <IconButton
        aria-label="Reload"
        onClick={() => {
          setReload(!reload);
        }}
        icon={<Icon as={ReloadOutlined} />}
        colorScheme="teal"
        marginTop="8px"
      />
    </Box>
  );
};

export default Reload;
