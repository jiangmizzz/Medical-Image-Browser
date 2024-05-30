import React, { useRef, useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import 'cropperjs/dist/cropper.css';
import Cropper from 'cropperjs';
import { DirType } from '../vite-env';

interface CropperComponentProps {
    zoomLevel: number;
    dir: DirType|null;
    aspectRatio?: number;
    onCrop?: (croppedArea: { x: number; y: number; width: number; height: number }) => void;
}

const CropperComponent: React.FC<CropperComponentProps> = ({ zoomLevel, dir, aspectRatio, onCrop }) => {
    const imageRef = useRef<HTMLImageElement>(null);
    const [lastZoomLevel, setLastZoomLevel] = useState<number>(1);
    const [cropperInstance, setCropperInstance] = useState<Cropper | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

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
    }, [dir]);

    useEffect(() => {
        if (cropperInstance && zoomLevel !== undefined) {
            cropperInstance.zoom(zoomLevel-lastZoomLevel);
            setLastZoomLevel(zoomLevel)
        }
    }, [zoomLevel]);

    if (dir === null) {
        <Box flexGrow={1}>
        <img 
            ref={imageRef} 
            src="../img/zju.png" 
            alt="Cropper" 
            style={{ 
                display: 'none',
                }} />
        </Box>
    } else {
        return (
            <Box flexGrow={1}>
            <img 
                ref={imageRef} 
                src={dir.imgs[currentImageIndex]} 
                alt="Cropper" 
                style={{ 
                    display: 'none',
                }} 
            />
            </Box>
        );
    }
};

export default CropperComponent;