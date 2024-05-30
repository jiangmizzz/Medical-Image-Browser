import {ColumnWidthOutlined} from "@ant-design/icons"
import {Box, IconButton} from "@chakra-ui/react"
import {Icon} from "@chakra-ui/icons"

const Scroll: React.FC = () => {
    return (
        <Box>
            <IconButton 
            aria-label='Scroll'
            icon={<Icon as={ColumnWidthOutlined}/>}
            colorScheme="teal"
            marginTop="8px"
            />
        </Box>
    )
}

export default Scroll;