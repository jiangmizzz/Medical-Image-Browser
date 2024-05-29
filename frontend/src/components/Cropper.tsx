import React, { useRef, useEffect, useState } from 'react';
import { Box, IconButton } from '@chakra-ui/react';
import {DragHandleIcon} from '@chakra-ui/icons';
import 'cropperjs/dist/cropper.css';
import Cropper from 'cropperjs';

interface CropperComponentProps {
    src: string;
    aspectRatio?: number;
    onCrop?: (croppedArea: { x: number; y: number; width: number; height: number }) => void;
}

const CropperComponent: React.FC<CropperComponentProps> = ({ src, aspectRatio, onCrop }) => {
    const imageRef = useRef<HTMLImageElement>(null);
    const [cropper, setCropper] = useState<Cropper | null>(null);

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
            crop(event) {
                if (onCrop) {
                    const { x, y, width, height } = event.detail;
                    onCrop({ x, y, width, height });
                }
            },
        });

        setCropper(newCropper);
        return () => {
            if (newCropper) {
            newCropper.destroy();
            setCropper(null);
            }
        };
        }
    }, [src, aspectRatio, onCrop]);

  return (
    <Box>
      <img ref={imageRef} src={src} alt="Cropper" style={{ display: 'none' }} />
    </Box>
  );
};

export default CropperComponent;