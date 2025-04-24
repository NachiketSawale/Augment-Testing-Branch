/*
 * Copyright(c) RIB Software GmbH
 */

import {IDimensionData} from './dimension-data.interface';
import {IDimensionSetting} from './dimension-setting.interface';

/**
 * Dimension entity
 */
export interface IDimensionEntity {
    ModelFk: number;
    ModelObjectFk: number;
    Uuid: string;
    Name: string;
    IsNegative: boolean;
    Layout: string;
    Scale?: number;
    Geometry: string;
    Data: IDimensionData;
    Setting: IDimensionSetting;
}