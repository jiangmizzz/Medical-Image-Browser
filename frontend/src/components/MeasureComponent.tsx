import React, { useState, useEffect, useRef } from "react";

interface MeasureComponentProps {
  zoomLevel: number;
  imgRef: React.RefObject<HTMLImageElement>;
}

const MeasureComponent: React.FC<MeasureComponentProps> = ({
  zoomLevel,
  imgRef,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [endPoint, setEndPoint] = useState<{ x: number; y: number } | null>(
    null,
  );

  // 处理鼠标按下事件
  const handleMouseDown = (event: React.MouseEvent<HTMLImageElement>) => {
    if (imgRef.current) {
      const rect = imgRef.current.getBoundingClientRect();
      setStartPoint({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
      console.log(rect);
      setIsDrawing(true);
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLImageElement>) => {
    if (isDrawing && startPoint !== null && imgRef.current) {
      const rect = imgRef.current.getBoundingClientRect();
      setEndPoint({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && startPoint && endPoint) {
      const ctx = canvasRef.current?.getContext("2d");
      if (ctx) {
        ctx.strokeStyle = "green";
        ctx.fillStyle = "green";
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(endPoint.x, endPoint.y);
        ctx.stroke();
        const distance =
          Math.sqrt(
            Math.pow(endPoint.x - startPoint.x, 2) +
              Math.pow(endPoint.y - startPoint.y, 2),
          ) / zoomLevel;
        ctx.font = "12px Arial";
        ctx.fillText(
          `${distance.toFixed(2)}px`,
          startPoint.x,
          startPoint.y - 10,
        );
      }
    }
    setIsDrawing(false);
    setEndPoint(null);
  };

  useEffect(() => {
    const updateCanvasSizeAndPosition = () => {
      if (imgRef.current) {
        const imageRect = imgRef.current.getBoundingClientRect();
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = imageRect.width;
          canvas.height = imageRect.height;
          // 设置 canvas 的绝对位置
          canvas.style.position = "absolute";
          canvas.style.top = `${imageRect.top}px`;
          canvas.style.left = `${imageRect.left}px`;
        }
      }
    };

    updateCanvasSizeAndPosition();

    return () => {};
  }, [imgRef]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown.bind(imgRef)}
        onMouseMove={handleMouseMove.bind(imgRef)}
        onMouseUp={handleMouseUp}
        style={{
          position: "relative",
        }}
      />
    </div>
  );
};

export default MeasureComponent;
