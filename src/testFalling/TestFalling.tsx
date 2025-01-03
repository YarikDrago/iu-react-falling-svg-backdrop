import React, {useEffect, useMemo, useRef, useState} from "react";
import queenIcon from "../assets/img/queen-icon.svg";
import snowFlake2 from "../assets/img/snow2.svg";
import {FallingBackdropTypes, FallingElementDataType} from "./types";
import {initElem} from "../fallingBackdrop/functions/initElem";

const TestFalling = ({ maxElements = 10 }: FallingBackdropTypes) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameIsRunning = useRef(false);
  const images = useMemo(() => [queenIcon, snowFlake2], []);
  const [loadedImages, setLoadedImages] = useState<HTMLImageElement[]>([]);
  const [isImagesLoaded, setIsImagesLoaded] = useState(false);
  //
  let elems = useRef<FallingElementDataType[]>([]);

  useEffect(() => {

    console.log("load images ");
    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image ${src}`));
      });
    };

    const loadAllImages = async () => {
      try {
        const loaded = await Promise.all(images.map((src) => loadImage(src)));
        setLoadedImages(loaded);
        // loadedImagesRef.current = loaded;
        setIsImagesLoaded(true);
      } catch (error) {
        console.log(error);
        setIsImagesLoaded(false);
      }
    };

    loadAllImages();
  }, [images]);

  useEffect(() => {
    if (!isImagesLoaded) return;
    initFallingElems()
    animationFrameIsRunning.current = true;
    requestAnimationFrame(animation);
    return () => {
      animationFrameIsRunning.current = false;
    };
  }, [isImagesLoaded]);

  function initFallingElems(){
    const newElems: FallingElementDataType[] = new Array(maxElements).fill([]);
    elems.current = newElems;
    for (let i = 0; i < maxElements; i++) {
      newElems[i] = initElem(images.length);
    }
  }

  function initElem(imagesAmount: number): FallingElementDataType {
    const maxLifelong = 20; // sec
    const newImgIdx = Math.floor(Math.random() * imagesAmount)
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
      const duration = elem.endTime - elem.startTime
      const newYPos =
          // elem.dist * (1 - (elem.endTime - Date.now()) / elem.endTime);
          (1 - (elem.endTime - Date.now()) / duration);
          // 0.5
      // elem.yPos += newYPos;
      elem.yPos = newYPos;
      // recalculate angle
      // elem.rotationXY += (Date.now() - elem.lastTime) / 1000 * (Math.PI / 9)
      // elem.rotationZH +=
      // rewrite last time recalculation (at the end)
      elem.lastTime = Date.now();
    }
    return elems
  }

  function animation() {
    recalculateElements(images.length)
    anime();
    requestAnimationFrame(animation);
  }

  function anime() {
    const [imageMinSize, imageMaxSize] = [15, 50]
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.height = 400;
    canvas.width = 400;
    const context = canvas.getContext("2d");
    if (!context) return;
    // context.fillStyle = "blue";
    // context.fillRect(0, 0, 350, 350);
    // console.log(Date.now() / 500)
    // for (let i = 0; i < 3; i++) {
    // console.log(loadedImages.length)
    for (let i = 0; i < elems.current.length; i++) {
      try{
        const elem = elems.current[i]
        const elemSize = imageMinSize + (imageMaxSize - imageMinSize) * elem.weight;
        // console.log(elem.imgIdx)
        // const elemXCenter = (i + 1) * 100
        // const elemYCenter = 100;
        // console.log(elem.yPos)
        const elemXCenter = elem.xPos * 400 - elemSize / 2;
        const elemYCenter = elem.yPos * 400 - elemSize / 2;
        context.fillStyle = "yellow";
        context.save();
        context.translate(elemXCenter, elemYCenter + elemSize / 2);
        context.rotate(Math.PI * 2 * ((Date.now() % 2000) / 2000));
        context.fillRect(
            -elemSize / 2,
            -elemSize / 2,
            elemSize,
            elemSize,
        );
        if (isImagesLoaded){
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
        console.log("ERROR:", i, elems.current[i].imgIdx)
      } finally {
        context.restore();
      }
    }
  }

  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{
          height: "400px",
          width: "400px",
          backgroundColor: "darkgreen",
        }}
      />
    </div>
  );
};

export default TestFalling;
