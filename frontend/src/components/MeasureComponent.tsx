import React, { useState, useEffect, useRef, useCallback } from "react";

interface ImageData {
  top: number;
  left: number;
  width: number;
  height: number;
  naturalWidth: number;
  naturalHeight: number;
}

interface CanvasData {
  top: number;
  left: number;
  width: number;
  height: number;
  naturalWidth: number;
  naturalHeight: number;
}

interface MeasureComponentProps {
  imageData?: ImageData;
  canvasData?: CanvasData;
  scale?: number;
}

const MeasureComponent: React.FC<MeasureComponentProps> = ({
  imageData,
  canvasData,
  scale,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lines, setLines] = useState<
    {
      startPoint: { x: number; y: number };
      endPoint: { x: number; y: number };
    }[]
  >([]);
  const [currentLine, setCurrentLine] = useState<{
    startPoint: { x: number; y: number };
    endPoint: { x: number; y: number } | null;
  }>({ endPoint: null });

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setCurrentLine({
          startPoint: {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
          },
          endPoint: null,
        });
        setIsDrawing(true);
      }
    },
    [canvasRef],
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (isDrawing && currentLine.startPoint) {
        if (canvasRef.current) {
          const rect = canvasRef.current.getBoundingClientRect();
          setCurrentLine((prevLine) => ({
            ...prevLine,
            endPoint: {
              x: event.clientX - rect.left,
              y: event.clientY - rect.top,
            },
          }));
        }
      }
    },
    [isDrawing, currentLine, canvasRef],
  );

  const handleMouseUp = useCallback(() => {
    if (isDrawing && currentLine.startPoint && currentLine.endPoint) {
      setLines((prevLines) => [...prevLines, currentLine]);
    }
    setIsDrawing(false);
    setCurrentLine({ startPoint: null, endPoint: null });
  }, [isDrawing, currentLine]);

  const drawAllLines = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    lines.forEach((line, index) => {
      ctx.beginPath();
      ctx.moveTo(line.startPoint.x, line.startPoint.y);
      ctx.lineTo(line.endPoint.x, line.endPoint.y);
      ctx.strokeStyle = "yellow";
      ctx.lineWidth = 2;
      ctx.stroke();

      const distance = calculateDistance(
        line.startPoint.x,
        line.startPoint.y,
        line.endPoint.x,
        line.endPoint.y,
        imageData?.naturalWidth === imageData?.naturalHeight,
      );
      ctx.font = "16px Arial";
      ctx.fillStyle = "yellow";
      ctx.fillText(
        `${(distance * scale).toFixed(2)}mm`,
        (line.startPoint.x + line.endPoint.x) / 2,
        (line.startPoint.y + line.endPoint.y) / 2 - 10,
      );
    });
  };

  const calculateDistance = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    isSquare: boolean,
  ) => {
    if (isSquare) {
      return Math.sqrt(
        Math.pow(((x2 - x1) * 16) / 808, 2) +
          Math.pow(((y2 - y1) * 16) / 808, 2),
      );
    } else {
      return Math.sqrt(
        Math.pow(((x2 - x1) * 16) / 808, 2) +
          Math.pow(((y2 - y1) * 3.55) / 1024, 2),
      );
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = imageData.width + 10;
      canvas.height = imageData.height + 10;
      canvas.style.position = "absolute";
      canvas.style.top = `${imageData.top + 175}px`;
      canvas.style.left = `${imageData.left - 5}px`;
      console.log(imageData);
      drawAllLines();
    }
  }, [imageData, lines, scale]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          position: "absolute",
          zIndex: 10,
        }}
      />
    </div>
  );
};

export default MeasureComponent;
