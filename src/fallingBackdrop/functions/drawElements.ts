import React from "react";
import {FallingElementDataType} from "../../testFalling/types";

export function drawElements(
    elems:  React.MutableRefObject<FallingElementDataType[]>,
    canvasRef: React.RefObject<HTMLCanvasElement>,
    backdropWidthRef: React.MutableRefObject<number>,
    backdropHeightRef: React.MutableRefObject<number>,
    loadedImages: HTMLImageElement[],
    isImageLoaded: boolean
){
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = backdropWidthRef.current;
    canvas.height = backdropHeightRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.fillStyle = "blue";
    context.fillRect(0, 0, backdropWidthRef.current, backdropHeightRef.current);
    context.fillStyle = "yellow";
    for (let i = 0; i < elems.current.length; i++) {
        const elem = elems.current[i];
        const imageWidth = 50; // Ширина SVG
        const imageHeight = 50; // Высота SVG
        const elemXCenter = elem.xPos * backdropWidthRef.current + 25;
        const elemYCenter = elem.yPos * backdropHeightRef.current + 25;
        context.save(); // Сохранить текущее состояние canvas
        context.translate(elemXCenter, elem.yPos + 25); // Переместить начало координат в центр изображения
        // context.rotate(elem.rotationXY); // Повернуть canvas на угол
        context.rotate(Math.PI / 4); // Повернуть canvas на угол
        context.fillRect(
            -imageWidth / 2,
            -imageHeight / 2,
            imageWidth,
            imageHeight,
        );
        if (isImageLoaded) {
        context.drawImage(
          // queenImg,
          loadedImages[1],
          -imageWidth / 2,
          -imageHeight / 2,
          imageWidth,
          imageHeight,
        );
        }
        context.restore(); // Восстановить исходное состояние canvas
    }
}
