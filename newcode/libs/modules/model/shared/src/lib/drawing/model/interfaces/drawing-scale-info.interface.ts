/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * The scale info of drawing
 */
export interface IDrawingScaleInfo {
    x: number;
    y: number;
    ratio: number;
    mode: number | null;
    angle: number;
    isImperial: boolean;
    isFeet: boolean;
}