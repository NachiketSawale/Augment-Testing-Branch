/*
 * Copyright(c) RIB Software GmbH
 */


import { RulerUnitCaption } from '../ruler-unit.enum';

/**
 * unit data
 */
export interface IUnit {
    /**
     * unit value
     */
    value: string;

    /**
     * unit caption
     */
    caption: RulerUnitCaption;

    /**
     * decimal places
     */
    decimal: number;
}