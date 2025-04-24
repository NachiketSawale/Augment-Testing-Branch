/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { IIdentificationData } from '@libs/platform/common';
import { IPpsFormulaVersionEntityGenerated } from './pps-formula-version-entity-generated.interface';

export interface IPpsFormulaVersionEntity extends IPpsFormulaVersionEntityGenerated {
    ClobToSave?: IIdentificationData | null;
}
