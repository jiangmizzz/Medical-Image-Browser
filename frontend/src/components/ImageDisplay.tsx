import React from 'react';
import { Box, Image } from '@chakra-ui/react';

interface ImageDisplayProps {
  src: string;
  zoomLevel: number;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ src, zoomLevel }) => {
    return (
    <Box
      width="100%"
      height="100%"
      overflow="hidden"
      style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
    >
      <Image src={src} alt="Medical Image" />
    </Box>
  );
};

export default ImageDisplay;