/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { CompleteIdentification } from '@libs/platform/common';
import { IPpsFormulaInstanceEntity } from './pps-formula-instance-entity.interface';
import { IPpsParameterValueEntity } from './pps-parameter-value-entity.interface';

export class PpsFormulaInstanceCompleteEntity extends CompleteIdentification<IPpsFormulaInstanceEntity> {
    public MainItemId: number = 0;
    public PpsFormulaInstance?: IPpsFormulaInstanceEntity;
    public PpsParameterValueToDelete?: IPpsParameterValueEntity[];
    public PpsParameterValueToSave?: IPpsParameterValueEntity[];
}
