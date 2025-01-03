export type FallingBackdropTypes = {
    maxElements?: number;
};

export type FallingElementDataType = {
    /** An index of used images */
    imgIdx: number;
    /** "Weight" of the element [0, 1] */
    weight: number;
    /** Horizontal position in percents [0, 1] */
    yPos: number;
    /** Vertical position in percents [0, 1] */
    xPos: number;
    /** */
    startTime: number;
    /** End of appearance */
    endTime: number;
    /** Time of last recalculation; */
    lastTime: number;
    dist: number;
    /** Horizontal fall velocity (px/sec) */
    horV: number;
    /** Falling angle */
    rotation: {
        x: number;
        y: number;
        z: number;
    };
    /** Blinking of element, ms */
    blinkCycleTime: number;
};
