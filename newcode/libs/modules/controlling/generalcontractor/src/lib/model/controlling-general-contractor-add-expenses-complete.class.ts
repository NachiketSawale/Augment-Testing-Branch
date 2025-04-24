import {CompleteIdentification} from '@libs/platform/common';
import {IGccAddExpenseEntity} from './entities/gcc-add-expense-entity.interface';

export class ControllingGeneralContractorAddExpensesComplete implements CompleteIdentification<IGccAddExpenseEntity>{
    public Id: number = 0;
}