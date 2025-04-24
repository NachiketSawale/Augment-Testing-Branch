/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstAllMarkup2costcodeEntityGenerated } from './est-all-markup-2costcode-entity-generated.interface';

export interface IEstAllMarkup2costcodeEntity extends IEstAllMarkup2costcodeEntityGenerated {
    isUpdateMajorCostCode: boolean;
    normalGcValue: number | null;
    AmPercConverted?: number | null;
    GaPercConverted?: number | null;
    RpPercConverted?: number | null;
    Version?: number;
}
