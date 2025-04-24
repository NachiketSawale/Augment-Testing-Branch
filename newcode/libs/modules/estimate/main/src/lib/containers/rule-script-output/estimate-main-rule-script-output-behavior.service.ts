import {IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import {Injectable} from '@angular/core';
import {IEstRuleResultVEntity} from '@libs/estimate/interfaces';

@Injectable({
    providedIn: 'root'
})

export class EstimateMainRuleScriptOutputBehaviorService implements IEntityContainerBehavior<IGridContainerLink<IEstRuleResultVEntity>, IEstRuleResultVEntity> {
    public onCreate(containerLink: IGridContainerLink<IEstRuleResultVEntity>): void {
        this.customizeToolbar(containerLink);
    }

    private customizeToolbar(containerLink: IGridContainerLink<IEstRuleResultVEntity>) {
        containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete']);
    }
}