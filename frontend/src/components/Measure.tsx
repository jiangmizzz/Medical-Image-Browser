import {MenuOutlined} from "@ant-design/icons"
import {Box, IconButton} from "@chakra-ui/react"
import {Icon} from "@chakra-ui/icons"

const Measure: React.FC = () => {
    return (
        <Box>
            <IconButton 
            aria-label='Move'
            icon={<Icon as={MenuOutlined} />}
            colorScheme="teal"
            marginTop="8px"
            />
        </Box>
    )
}

export default Measure;