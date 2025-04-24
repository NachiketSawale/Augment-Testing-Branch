/*
 * Copyright(c) RIB Software GmbH
 */


import { RulerUnitCaption } from '../ruler-unit.enum';

/**
 * Used to stored units data.
 */
export interface IEditorUnits {
    /**
     * unit value
     */
    value: string;

    /**
     * caption
     */
    caption: RulerUnitCaption;

    /**
     * decimal
     */
    decimal: number;
}