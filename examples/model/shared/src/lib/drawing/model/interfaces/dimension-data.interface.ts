/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Dimension data object
 */
export interface IDimensionData {
    Count: number;
    Length: number;
    Area: number;
    Volume: number;
    Width: number;
    Height: number;
    WallArea: number;
    Offset: number;
    SegmentCount: number;
    VertexCount: number;
    Multiplier?: number;
    CutoutArea?: number;
    CutoutLength?: number;
    AreaExcludingCutouts?: number;
    LengthExcludingCutouts?: number;
    SegmentCountExcludingCutouts?: number;
    VertexCountExcludingCutouts?: number;
    Formulas?: string[];
}