/*
 * Copyright(c) RIB Software GmbH
 */

import {IDimensionEntity} from './dimension-entity.interface';

/**
 * Calibration context interface
 */
export interface ICalibrationContext {
    ModelId: number;
    LayoutId: string;
    BaseUnitId?: number | null;
}

/**
 * Calibration data object
 */
export interface ICalibrationData {
    OldScale: number;
    NewScale: number;
    OldUomFk?: number | null;
    NewUomFk?: number | null;
    IsScaleChanged?: boolean;
    IsUomChanged?: boolean;
    IsCustomLayout: boolean;
}

/**
 * Calibration request
 */
export interface ICalibrationRequest {
    modelId: number;
    layoutId: string;
    custom: boolean;
    newScale: number;
    newUomFk?: number | null;
}

/**
 * Calibration preview request
 */
export interface ICalibrationPreviewResponse {
    AffectedObjectCount: number;
    Dimensions: IDimensionEntity[];
}