import React from "react";
import { IconButton, HStack } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icons";

import { ZoomInOutlined, ZoomOutOutlined } from "@ant-design/icons";

interface ZoomControlProps {
  zoomLevel: number;
  setZoomLevel: (z: number) => void;
}

const ZoomControl: React.FC<ZoomControlProps> = ({
  zoomLevel,
  setZoomLevel,
}) => {
  const handleZoomIn = () => {
    // 每次放大10%应该够吧
    setZoomLevel(zoomLevel + 0.1);
  };

  const handleZoomOut = () => {
    // 下限10%
    setZoomLevel(Math.max(0.1, zoomLevel - 0.1));
  };

  return (
    <HStack spacing={7}>
      <IconButton
        aria-label="Zoom In"
        onClick={handleZoomIn}
        icon={<Icon as={ZoomInOutlined} />}
        colorScheme="teal"
      />
      <IconButton
        aria-label="Zoom Out"
        onClick={handleZoomOut}
        icon={<Icon as={ZoomOutOutlined} />}
        colorScheme="teal"
      />
    </HStack>
  );
};

export default ZoomControl;
