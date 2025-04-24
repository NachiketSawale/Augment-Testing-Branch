/*
 * Copyright(c) RIB Software GmbH
 */

import { IUnit } from './interfaces/unit.interface';
import { RulerUnitCaption } from './ruler-unit.enum';


/**
 * units 
 */
export const units: IUnit[] = [
    {
        value: '1',
        caption: RulerUnitCaption.mm,
        decimal: 1,
    },
    {
        value: '2',
        caption: RulerUnitCaption.cm,
        decimal: 2,
    },
    {
        value: '3',
        caption: RulerUnitCaption.in,
        decimal: 3,
    },
];