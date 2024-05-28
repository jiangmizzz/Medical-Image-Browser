import {ReloadOutlined} from "@ant-design/icons"
import {Box, IconButton} from "@chakra-ui/react"
import {Icon} from "@chakra-ui/icons"

const Reload: React.FC = () => {
    return (
        <Box>
            <IconButton 
            aria-label='Move'
            icon={<Icon as={ReloadOutlined} />}
            colorScheme="teal"
            marginTop="8px"
            />
        </Box>
    )
}

export default Reload;