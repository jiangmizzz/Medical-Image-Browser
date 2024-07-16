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
    setZoomLevel(Math.round((zoomLevel + 0.1) * 10) / 10);
  };

  const handleZoomOut = () => {
    setZoomLevel(Math.round(Math.max(0.1, zoomLevel - 0.1) * 10) / 10);
  };

  return (
    <HStack spacing={7}>
      {zoomLevel > 1.0 ? (
        <IconButton
          aria-label="Zoom In"
          onClick={handleZoomIn}
          icon={<Icon as={ZoomInOutlined} />}
          colorScheme="teal"
        />
      ) : (
        <IconButton
          aria-label="Zoom In"
          onClick={handleZoomIn}
          icon={<Icon as={ZoomInOutlined} />}
          colorScheme="teal"
          variant={"outline"}
        />
      )}
      {zoomLevel < 1.0 ? (
        <IconButton
          aria-label="Zoom Out"
          onClick={handleZoomOut}
          icon={<Icon as={ZoomOutOutlined} />}
          colorScheme="teal"
        />
      ) : (
        <IconButton
          aria-label="Zoom Out"
          onClick={handleZoomOut}
          icon={<Icon as={ZoomOutOutlined} />}
          colorScheme="teal"
          variant={"outline"}
        />
      )}
    </HStack>
  );
};

export default ZoomControl;
