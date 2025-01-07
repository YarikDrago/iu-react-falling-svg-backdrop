import React, { useEffect, useMemo, useRef, useState } from "react";
import queenIcon from "../assets/img/queen-icon.svg";
import snowFlake2 from "../assets/img/snow2.svg";
import { FallingBackdropTypes, FallingElementDataType } from "./types";

const TestFalling = ({ maxElements = 10 }: FallingBackdropTypes) => {
  const backdropRef = useRef(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameIsRunning = useRef(false);
  const images = useMemo(() => [queenIcon, snowFlake2], []);
  const [loadedImages, setLoadedImages] = useState<HTMLImageElement[]>([]);
  const [isImagesLoaded, setIsImagesLoaded] = useState(false);
  const backdropWidthRef = useRef(0);
  const backdropHeightRef = useRef(0);
  const [backdropWidth, setBackdropWidth] = useState(0);
  const [backdropHeight, setBackdropHeight] = useState(0);
  //
  let elems = useRef<FallingElementDataType[]>([]);
  /** Color of falling elements */
  const elemColor = "#7ab4ee";

  const loadImageWithColor = async (
    src: string,
    color: string,
  ): Promise<HTMLImageElement> => {
    try {
      // Загружаем содержимое SVG как текст
      const response = await fetch(src);
      if (!response.ok) {
        throw new Error(`Failed to fetch SVG: ${src}`);
      }
      const svgText = await response.text();

      // Изменяем цвет SVG
      const coloredSVG = svgText.replace(/fill="[^"]*"/g, `fill="${color}"`);

      // Создаем Blob и объект URL
      const blob = new Blob([coloredSVG], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);

      // Загружаем в Image
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          URL.revokeObjectURL(url); // Освобождаем URL после загрузки
          resolve(img);
        };
        img.onerror = () =>
          reject(new Error(`Failed to load modified SVG: ${src}`));
        img.src = url;
      });
    } catch (error) {
      throw new Error(`Error processing SVG: ${error}`);
    }
  };

  const loadAllImagesWithColor = async (
    images: string[],
    color: string,
  ): Promise<HTMLImageElement[]> => {
    return Promise.all(images.map((src) => loadImageWithColor(src, color)));
  };

  useEffect(() => {
    // const images = ["path/to/image1.svg", "path/to/image2.svg"];
    loadAllImagesWithColor(images, elemColor)
      .then((loadedImages) => {
        setLoadedImages(loadedImages);
        setIsImagesLoaded(true);
      })
      .catch((error) => {
        console.error(error);
        setIsImagesLoaded(false);
      });
  }, [images]);

  useEffect(() => {
    if (!isImagesLoaded) return;
    initFallingElems();
    animationFrameIsRunning.current = true;
    requestAnimationFrame(animation);
    return () => {
      animationFrameIsRunning.current = false;
    };
  }, [isImagesLoaded]);

  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  function resize() {
    if (!backdropRef.current) return;
    const backdropElem = backdropRef.current as HTMLElement;
    setBackdropWidth(backdropElem.offsetWidth);
    backdropWidthRef.current = backdropElem.offsetWidth;
    setBackdropHeight(backdropElem.offsetHeight);
    backdropHeightRef.current = backdropElem.offsetHeight;
  }

  function initFallingElems() {
    const newElems: FallingElementDataType[] = new Array(maxElements).fill([]);
    elems.current = newElems;
    for (let i = 0; i < maxElements; i++) {
      newElems[i] = initElem(images.length);
    }
  }

  function initElem(imagesAmount: number): FallingElementDataType {
    const maxLifelong = 20; // sec
    const newImgIdx = Math.floor(Math.random() * imagesAmount);
    // console.log("new image idx:", newImgIdx)
    return {
      // imgIdx: Math.floor(Math.random() * imagesAmount),
      imgIdx: newImgIdx,
      weight: Math.random(),
      xPos: Math.random(),
      yPos: 0,
      startTime: Date.now(),
      endTime: Date.now() + (2 + Math.random() * maxLifelong) * 1000,
      // endTime: Date.now() + 5000,
      lastTime: Date.now(),
      dist: Math.random(),
      // dist: 1,
      horV: 20,
      rotation: {
        x: 0,
        y: 0,
        z: 0,
      },
      // TODO change
      blinkCycleTime: 0,
    };
  }

  function recalculateElements(imagesAmount: number) {
    for (let i = 0; i < elems.current.length; i++) {
      if (Date.now() > elems.current[i].endTime) {
        // reset element
        elems.current[i] = initElem(imagesAmount);
      }
      const elem = elems.current[i];
      // recalculate y position [0, 1]
      // console.log(1 - (elem.endTime - Date.now()) / elem.endTime)
      const duration = elem.endTime - elem.startTime;
      const newYPos =
        // elem.dist * (1 - (elem.endTime - Date.now()) / elem.endTime);
        1 - (elem.endTime - Date.now()) / duration;
      // 0.5
      // elem.yPos += newYPos;
      elem.yPos = newYPos;
      // recalculate angle
      // elem.rotationXY += (Date.now() - elem.lastTime) / 1000 * (Math.PI / 9)
      // elem.rotationZH +=
      // rewrite last time recalculation (at the end)
      elem.lastTime = Date.now();
    }
    return elems;
  }

  function animation() {
    recalculateElements(images.length);
    anime();
    requestAnimationFrame(animation);
  }

  function anime() {
    const [imageMinSize, imageMaxSize] = [15, 50];
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.height = backdropHeightRef.current;
    canvas.width = backdropWidthRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;
    // context.fillStyle = "blue";
    // context.fillRect(0, 0, 350, 350);
    // console.log(Date.now() / 500)
    // for (let i = 0; i < 3; i++) {
    // console.log(loadedImages.length)
    for (let i = 0; i < elems.current.length; i++) {
      try {
        const elem = elems.current[i];
        const elemSize =
          imageMinSize + (imageMaxSize - imageMinSize) * elem.weight;
        // console.log(elem.imgIdx)
        // const elemXCenter = (i + 1) * 100
        // const elemYCenter = 100;
        // console.log(elem.yPos)
        const elemXCenter = elem.xPos * backdropWidthRef.current - elemSize / 2;
        const elemYCenter =
          elem.yPos * backdropHeightRef.current - elemSize / 2;
        // context.fillStyle = "yellow";
        context.save();
        context.translate(elemXCenter, elemYCenter + elemSize / 2);
        context.rotate(Math.PI * 2 * ((Date.now() % 2000) / 2000));
        // context.fillRect(-elemSize / 2, -elemSize / 2, elemSize, elemSize);
        if (isImagesLoaded) {
          // console.log(loadedImages.length)
          context.drawImage(
            // loadedImages[1],
            loadedImages[elem.imgIdx],
            -elemSize / 2,
            -elemSize / 2,
            elemSize,
            elemSize,
          );
        }
        // context.restore();
      } catch (e) {
        console.log("ERROR:", i, elems.current[i].imgIdx);
      } finally {
        context.restore();
      }
    }
  }

  return (
    <div
      ref={backdropRef}
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "darkred",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          height: backdropHeight,
          width: backdropWidth,
          backgroundColor: "darkgreen",
        }}
      />
    </div>
  );
};

export default TestFalling;
