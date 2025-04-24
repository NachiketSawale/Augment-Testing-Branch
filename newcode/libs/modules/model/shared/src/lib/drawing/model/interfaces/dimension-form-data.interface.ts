/*
 * Copyright(c) RIB Software GmbH
 */

import {IDimensionData} from './dimension-data.interface';

/**
 * Dimension form data when editing dimension
 */
export interface IDimensionFormData extends IDimensionData {
    Name: string;
}