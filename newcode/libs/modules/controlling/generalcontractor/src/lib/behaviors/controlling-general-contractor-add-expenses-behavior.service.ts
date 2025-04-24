import {Injectable, InjectionToken} from '@angular/core';
import {IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import {IGccAddExpenseEntity} from '../model/entities/gcc-add-expense-entity.interface';

export const CONTROLLING_GENERAL_CONTRACTOR_ADDITIONAL_EXPENSES_BEHAVIOR_TOKEN = new InjectionToken<ControllingGeneralContractorAddExpensesBehavior>('controllingGeneralContractorAddExpensesBehavior');

@Injectable({
    providedIn: 'root'
})
export class ControllingGeneralContractorAddExpensesBehavior implements IEntityContainerBehavior<IGridContainerLink<IGccAddExpenseEntity>, IGccAddExpenseEntity> {

    public onCreate(containerLink: IGridContainerLink<IGccAddExpenseEntity>): void {
        this.customizeToolbar(containerLink);
    }

    private customizeToolbar(containerLink: IGridContainerLink<IGccAddExpenseEntity>) {
        containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete']);
    }
}