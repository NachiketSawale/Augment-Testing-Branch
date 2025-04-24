/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Get model info response
 */
export interface IModelInfoResponse {
    modelUuid: string;
    modelCode: string;
}

/**
 * Drawing info
 */
export interface IDrawingModelInfo {
    converted: boolean;
    drawingId: string;
    code: string;
    description?: string;
}