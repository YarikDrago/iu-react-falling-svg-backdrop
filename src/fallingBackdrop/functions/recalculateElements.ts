import {FallingElementDataType} from "../../testFalling/types";
import {initElem} from "./initElem";
import React from "react";

export function recalculateElements(elems:  React.MutableRefObject<FallingElementDataType[]>, imagesAmount: number) {
    for (let i = 0; i < elems.current.length; i++) {
        if (Date.now() > elems.current[i].endTime) {
            // reset element
            elems.current[i] = initElem(imagesAmount);
        }
        const elem = elems.current[i];
        // recalculate y position [0, 1]
        // console.log(elem.dist)
        const newYPos =
            elem.dist * (1 - (elem.endTime - Date.now()) / elem.endTime);
        elem.yPos += newYPos;
        // recalculate angle
        // elem.rotationXY += (Date.now() - elem.lastTime) / 1000 * (Math.PI / 9)
        // elem.rotationZH +=
        // rewrite last time recalculation (at the end)
        elem.lastTime = Date.now();
    }
    return elems
}
