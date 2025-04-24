/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { CompleteIdentification } from '@libs/platform/common';
import { IPpsFormulaVersionEntity } from './pps-formula-version-entity.interface';
import { IPpsParameterEntity } from './pps-parameter-entity.interface';

export class PpsFormulaVersionCompleteEntity extends CompleteIdentification<IPpsFormulaVersionEntity> {
    public MainItemId: number = 0;
    public PpsFormulaVersion?: IPpsFormulaVersionEntity;
    public PpsParameterToDelete?: IPpsParameterEntity[];
    public PpsParameterToSave?: IPpsParameterEntity[];
}
