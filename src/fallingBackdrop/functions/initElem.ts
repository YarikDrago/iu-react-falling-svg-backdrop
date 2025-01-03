import { FallingElementDataType } from "../../testFalling/types";

export function initElem(imagesAmount: number): FallingElementDataType {
  const maxLifelong = 20; // sec
  return {
    imgIdx: Math.floor(Math.random() * imagesAmount),
    weight: Math.random(),
    xPos: Math.random(),
    yPos: 0,
    // endTime: Date.now() + (2 + Math.random() * maxLifelong) * 1000,
    startTime: Date.now(),
    endTime: Date.now() + 5000,
    lastTime: Date.now(),
    // dist: Math.random(),
    dist: 1,
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
