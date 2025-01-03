import React, { useEffect, useRef, useState } from "react";
import "./FallingBackdrop.css";
import queenIcon from "../../assets/img/queen-icon.svg";
import snowFlake2 from "../../assets/img/snow2.svg";
import { FallingBackdropTypes, FallingElementDataType } from "../../testFalling/types";
import { recalculateElements } from "../functions/recalculateElements";
import { initElem } from "../functions/initElem";
import { drawElements } from "../functions/drawElements";

const FallingBackdrop = ({ maxElements = 10 }: FallingBackdropTypes) => {
  const backdropRef = useRef(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameIsRunning = useRef(false);
  const [backdropWidth, setBackdropWidth] = useState(0);
  const [backdropHeight, setBackdropHeight] = useState(0);
  const backdropWidthRef = useRef(0);
  const backdropHeightRef = useRef(0);
  // const [elems, setElems] = useState<FallingElementDataType[]>([]);
  let elems = useRef<FallingElementDataType[]>([]);
  // current time
  const currTimeRef = useRef<Date>(new Date());
  // Хранение загруженных изображений
  const [loadedImages, setLoadedImages] = useState<HTMLImageElement[]>([]);

  const images = [queenIcon, snowFlake2];
  const loadedImagesRef = useRef<HTMLImageElement[]>([]);
  // const [loadedImages, setLoadedImages] = useState<HTMLImageElement[]>([]);
  const [isImagesLoaded, setIsImagesLoaded] = useState(false);

  useEffect(() => {
    console.log("load images");
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
        // setLoadedImages(loaded);
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
    // init falling elements
    // elems.current = initFallingElems(maxElements, elems);
    initFallingElems();
    animationFrameIsRunning.current = true;
    // start animation
    animation();
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

  useEffect(() => {
    console.log(backdropWidthRef.current, backdropHeightRef.current);
  }, [backdropWidthRef.current]);

  function resize() {
    console.log("resize");
    if (!backdropRef.current) return;
    const backdropElem = backdropRef.current as HTMLElement;
    setBackdropWidth(backdropElem.offsetWidth);
    backdropWidthRef.current = backdropElem.offsetWidth;
    setBackdropHeight(backdropElem.offsetHeight);
    backdropHeightRef.current = backdropElem.offsetHeight;
  }

  function animation() {
    // console.log("animation", animationFrameIsRunning.current)
    currTimeRef.current = new Date();
    const currTime = currTimeRef.current;
    elems = recalculateElements(elems, images.length);
    drawElements(
      elems,
      canvasRef,
      backdropWidthRef,
      backdropHeightRef,
      loadedImages,
      isImagesLoaded,
    );
    // testDraw()
    if (!animationFrameIsRunning.current) return;
    requestAnimationFrame(animation);
  }

  function initFallingElems() {
    const newElems: FallingElementDataType[] = new Array(maxElements).fill([]);
    elems.current = newElems;
    for (let i = 1; i <= maxElements; i++) {
      newElems[i] = initElem(images.length);
    }
  }

  return (
    <div className={"backdrop"} ref={backdropRef}>
      <canvas
        ref={canvasRef}
        style={{
          height: backdropHeight,
          // height: 100,
          width: backdropWidth,
          // width: 100,
          // backgroundColor: "blue",
        }}
      />
    </div>
  );
};

export default FallingBackdrop;
