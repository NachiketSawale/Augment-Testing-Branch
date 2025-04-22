/*
 * Copyright(c) RIB Software GmbH
 */

import {IDimensionData} from './interfaces/dimension-data.interface';

export class DimensionData implements IDimensionData {
    public Count: number = 0;
    public Length: number = 0;
    public Area: number = 0;
    public Volume: number = 0;
    public Width: number = 0;
    public Height: number = 0;
    public WallArea: number = 0;
    public Offset: number = 0;
    public Multiplier: number = 1;
    public SegmentCount: number = 0;
    public VertexCount: number = 0;
    public Formulas: string[] = [];
}