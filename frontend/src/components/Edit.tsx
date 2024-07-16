import { EditOutlined } from "@ant-design/icons";
import { Box, IconButton } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icons";

interface EditProps {
  edit: boolean;
  setEdit: (edit: boolean) => void;
}

const Edit: React.FC<EditProps> = ({ edit, setEdit }) => {
  return edit === false ? (
    <Box>
      <IconButton
        aria-label="Edit"
        icon={<Icon as={EditOutlined} />}
        colorScheme="teal"
        marginTop="8px"
        onClick={() => setEdit(!edit)}
        variant={"outline"}
      />
    </Box>
  ) : (
    <Box>
      <IconButton
        aria-label="Edit"
        icon={<Icon as={EditOutlined} />}
        colorScheme="teal"
        marginTop="8px"
        onClick={() => setEdit(!edit)}
      />
    </Box>
  );
};

export default Edit;
