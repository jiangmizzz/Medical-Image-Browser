import {TagOutlined} from "@ant-design/icons"
import {Box, IconButton} from "@chakra-ui/react"
import {Icon} from "@chakra-ui/icons"

const Tag: React.FC = () => {
    return (
        <Box>
            <IconButton 
            aria-label='Tag'
            icon={<Icon as={TagOutlined} />}
            colorScheme="teal"
            marginTop="8px"
            />
        </Box>
    )
}

export default Tag;