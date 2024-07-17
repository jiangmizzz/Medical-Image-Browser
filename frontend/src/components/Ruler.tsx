import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface RulerProps {
  zoomLevel: number;
}

const RulerComponent: React.FC<RulerProps> = ({ zoomLevel }) => {
  const svgRef = useRef(null);
  const [rulerLength, setRulerLength] = useState(50);
  useEffect(() => {
    if (svgRef.current && zoomLevel !== undefined) {
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();

      // 绘制线段
      const line = d3
        .line()
        .x((d) => d.x)
        .y((d) => d.y);

      const line1 = [
        { x: 1, y: 10 },
        { x: 51, y: 10 },
      ];

      const line2 = [
        { x: 2, y: 10 },
        { x: 2, y: 5 },
      ];

      const line3 = [
        { x: 50, y: 10 },
        { x: 50, y: 5 },
      ];

      svg
        .append("path")
        .data([line1])
        .attr("d", line)
        .attr("stroke", "#5acbe6")
        .attr("stroke-width", 2)
        .attr("fill", "none");

      svg
        .append("path")
        .data([line2])
        .attr("d", line)
        .attr("stroke", "#5acbe6")
        .attr("stroke-width", 2)
        .attr("fill", "none");

      svg
        .append("path")
        .data([line3])
        .attr("d", line)
        .attr("stroke", "#5acbe6")
        .attr("stroke-width", 2)
        .attr("fill", "none");

      const actualLength = rulerLength / zoomLevel;

      const lengthText = svg
        .append("text")
        .attr("x", 60)
        .attr("y", 13)
        .text(`${((actualLength * 16) / 808).toFixed(2)} mm`)
        .attr("fill", "gray");
    }
  }, [rulerLength, zoomLevel, svgRef]);

  return <svg ref={svgRef} />;
};

export default RulerComponent;
