/*
 * Copyright(c) RIB Software GmbH
 */

import {IDimensionGroupConfig} from './dimension-group-config.interface';

/**
 * Dimension group entity
 */
export interface IDimensionGroupEntity {
    dimensionGroupId: string;
    dimensionPreview: string;
    dimensionType: string;
    displayValue: string;
    folder: string;
    name: string;
    negativeConfig: IDimensionGroupConfig;
    positiveConfig: IDimensionGroupConfig;
    version: number;
    DimensionIds: string[];
}