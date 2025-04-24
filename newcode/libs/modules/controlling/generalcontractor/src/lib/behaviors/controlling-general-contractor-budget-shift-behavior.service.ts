import {Injectable, InjectionToken} from '@angular/core';
import {IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import {IGccBudgetShiftEntity} from '../model/entities/gcc-budget-shift-entity.interface';

export const CONTROLLING_GENERAL_CONTRACTOR_BUDGET_SHIFT_BEHAVIOR_TOKEN = new InjectionToken<ControllingGeneralContractorBudgetShiftBehavior>('controllingGeneralContractorBudgetShiftBehavior');

@Injectable({
    providedIn: 'root'
})
export class ControllingGeneralContractorBudgetShiftBehavior implements IEntityContainerBehavior<IGridContainerLink<IGccBudgetShiftEntity>, IGccBudgetShiftEntity> {

    public onCreate(containerLink: IGridContainerLink<IGccBudgetShiftEntity>): void {
        this.customizeToolbar(containerLink);
    }

    private customizeToolbar(containerLink: IGridContainerLink<IGccBudgetShiftEntity>) {
        containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete']);
    }
}