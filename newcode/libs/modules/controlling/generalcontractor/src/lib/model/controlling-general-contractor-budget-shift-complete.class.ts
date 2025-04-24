import {CompleteIdentification} from '@libs/platform/common';
import {IGccBudgetShiftEntity} from './entities/gcc-budget-shift-entity.interface';

export class ControllingGeneralContractorBudgetShiftComplete implements CompleteIdentification<IGccBudgetShiftEntity>{
    public Id: number = 0;
}