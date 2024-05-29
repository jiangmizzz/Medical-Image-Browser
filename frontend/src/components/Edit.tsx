import {EditOutlined} from "@ant-design/icons"
import {Box, IconButton} from "@chakra-ui/react"
import {Icon} from "@chakra-ui/icons"

const Edit: React.FC = () => {
    return (
        <Box>
            <IconButton 
            aria-label='Edit'
            icon={<Icon as={EditOutlined} />}
            colorScheme="teal"
            marginTop="8px"
            />
        </Box>
    )
}

export default Edit;