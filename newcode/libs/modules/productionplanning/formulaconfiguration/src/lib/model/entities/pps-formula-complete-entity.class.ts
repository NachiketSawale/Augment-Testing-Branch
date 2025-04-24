/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IPpsFormulaEntity } from './pps-formula-entity.interface';
import { IPpsFormulaVersionEntity } from './pps-formula-version-entity.interface';
import { PpsFormulaVersionCompleteEntity } from './pps-formula-version-complete-entity.class';
import { IPpsFormulaInstanceEntity } from './pps-formula-instance-entity.interface';
import { PpsFormulaInstanceCompleteEntity } from './pps-formula-instance-complete-entity.class';
import { IPpsParameterEntity } from './pps-parameter-entity.interface';

export class PpsFormulaCompleteEntity extends CompleteIdentification<IPpsFormulaEntity> {
    public MainItemId: number = 0;
    public PpsFormula?: IPpsFormulaEntity[];
    public PpsFormulaInstanceToSave?: PpsFormulaInstanceCompleteEntity[];
    public PpsFormulaInstanceToDelete?: IPpsFormulaInstanceEntity[];
    public PpsFormulaVersionToSave?: PpsFormulaVersionCompleteEntity[];
    public PpsFormulaVersionToDelete?: IPpsFormulaVersionEntity[];
    public PpsParameterToSave?: IPpsParameterEntity[];
    public PpsParameterToDelete?: IPpsParameterEntity[];
}
