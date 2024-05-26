import React, { useState } from "react";
import {Button, VStack} from "@chakra-ui/react";
import {AddIcon, MinusIcon} from "@chakra-ui/icons";

interface ZoomControlProps {
    initialZoom: number;
}

const ZoomControl: React.FC<ZoomControlProps> = ({ initialZoom }) => {
    const [zoomLevel, setZoomLevel] = useState(initialZoom);

    const handleZoomIn = () => {
        // 每次放大10%应该够吧
        setZoomLevel(zoomLevel + 0.1);
    };

    const handleZoomOut = () => {
        // 下限10%
        setZoomLevel(Math.max(0.1, zoomLevel - 0.1)); 
    };

  return (
    <VStack marginTop="10px">
      <Button onClick={handleZoomIn} leftIcon={<AddIcon />} colorScheme="teal"></Button>
      <Button onClick={handleZoomOut} leftIcon={<MinusIcon />} colorScheme="teal"></Button>
    </VStack>
  );
};

export default ZoomControl;