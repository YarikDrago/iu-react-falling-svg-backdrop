import React, { useEffect, useRef, useState } from "react";
import queenIcon from "../../assets/img/queen-icon.svg";
import snowFlake2 from "../../assets/img/snow2.svg";

type RandomSvgProps = {
  /** The number of displayed elements */
  amount?: number;
  /** The minimum lifetime of a displayed element */
  minLifetimeMs?: number;
  /** The maximum lifetime of a displayed element */
  maxLifetimeMs?: number;
};

type ElemProps = {
  endTime: number;
  idx: number;
};

const RandomSvg = ({
  amount = 3,
  minLifetimeMs = 500,
  maxLifetimeMs = 1000,
}: RandomSvgProps) => {
  const images = [queenIcon, snowFlake2];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loadedImages, setLoadedImages] = useState<HTMLImageElement[]>([]);
  const loadedImagesRef = useRef<HTMLImageElement[]>([]);
  const [isImagesLoaded, setIsImagesLoaded] = useState(false);
  const currTimeRef = useRef<number>(Date.now());
  const elemsRef = useRef<ElemProps[]>([]);

  if (minLifetimeMs >= maxLifetimeMs) {
    maxLifetimeMs = maxLifetimeMs + 1000;
  }

  useEffect(() => {
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
        loadedImagesRef.current = loaded;
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
    initElements();
    animation();
  }, [isImagesLoaded]);

  function initElements() {
    const newElems: ElemProps[] = [];
    for (let i = 0; i < amount; i++) {
      newElems.push(initElement());
    }
    elemsRef.current = newElems;
  }

  function initElement(): ElemProps {
    return {
      endTime:
        Date.now() +
        minLifetimeMs +
        Math.random() * (maxLifetimeMs - minLifetimeMs),
      idx: Math.floor(Math.random() * loadedImagesRef.current.length),
    };
  }

  function recalculateElemsData() {
    for (let i = 0; i < elemsRef.current.length; i++) {
      const elem = elemsRef.current[i];
      if (elem.endTime <= currTimeRef.current) {
        elemsRef.current[i] = initElement();
      }
    }
  }

  function animation() {
    currTimeRef.current = Date.now();
    recalculateElemsData();
    drawElements();
    requestAnimationFrame(animation);
  }

  function drawElements() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 400;
    canvas.height = 400;
    const context = canvas.getContext("2d");
    if (!context) return;
    // for (let i = 0; i < loadedImagesRef.current.length; i++){
    //     const img = loadedImagesRef.current[i]
    //     context.drawImage(img, (i + 1) * 100, 50, 50, 50)
    // }
    for (let i = 0; i < elemsRef.current.length; i++) {
      const elem = elemsRef.current[i];
      context.drawImage(loadedImages[elem.idx], (i + 1) * 100, 50, 50, 50);
    }
  }

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        style={{ backgroundColor: "green" }}
      />
    </div>
  );
};

export default RandomSvg;
