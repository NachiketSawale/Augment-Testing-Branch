/*
 * Copyright(c) RIB Software GmbH
 */

export class DrawingLayoutConfig {
    public lid: string | null = null; // layout id
    public name: string | null = null;// layout name
    public uomFk: number | null = null;
    public drawingDistanceX = 1.0;
    public actualDistanceX = 1.0;
    public drawingDistanceY = 1.0;
    public actualDistanceY = 1.0;
    public drawingDistance = 1.0;
    public actualDistance = 1.0;
    public calibrated = false;
    public angle = 0;
    public calibration: number | null = null;
    public custom = false;
    public isFeet = false;
    public isImperial = false;
}