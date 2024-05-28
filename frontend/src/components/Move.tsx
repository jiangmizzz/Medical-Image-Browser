import {DragOutlined} from "@ant-design/icons"
import {Box, IconButton} from "@chakra-ui/react"
import {Icon} from "@chakra-ui/icons"

const Move: React.FC = () => {
    return (
        <Box>
            <IconButton 
            aria-label='Move'
            icon={<Icon as={DragOutlined} />}
            colorScheme="teal"
            marginTop="8px"
            />
        </Box>
    )
}

export default Move;