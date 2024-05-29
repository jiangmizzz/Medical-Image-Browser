import React, { useRef, useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import 'cropperjs/dist/cropper.css';
import Cropper from 'cropperjs';

interface CropperComponentProps {
    zoomLevel: number;
    src: string;
    aspectRatio?: number;
    onCrop?: (croppedArea: { x: number; y: number; width: number; height: number }) => void;
}

const CropperComponent: React.FC<CropperComponentProps> = ({ zoomLevel, src, aspectRatio, onCrop }) => {
    const imageRef = useRef<HTMLImageElement>(null);
    const [lastZoomLevel, setLastZoomLevel] = useState<number>(1);
    const [cropperInstance, setCropperInstance] = useState<Cropper | null>(null);

    useEffect(() => {
        if (imageRef.current) {
        const newCropper = new Cropper(imageRef.current, {
            aspectRatio: aspectRatio,
            dragMode: 'move',
            cropBoxMovable: false,
            modal: false,
            guides: false,
            highlight: false,
            background: false,
            center: false,
            autoCrop: false,
            autoCropArea: 1,
            viewMode: 0
        });

        setCropperInstance(newCropper);
        setLastZoomLevel(zoomLevel);

        return () => {
            if (newCropper) {
            newCropper.destroy();
            setCropperInstance(null);
            }
        };
        }
    }, [src]);

    useEffect(() => {
        if (cropperInstance && zoomLevel !== undefined) {
            cropperInstance.zoom(zoomLevel-lastZoomLevel);
            setLastZoomLevel(zoomLevel)
        }
      }, [zoomLevel]);
  return (
    <Box
        flexGrow={1}
        >
      <img 
        ref={imageRef} 
        src={src} 
        alt="Cropper" 
        style={{ 
            display: 'none',
            }} />
    </Box>
  );
};

export default CropperComponent;