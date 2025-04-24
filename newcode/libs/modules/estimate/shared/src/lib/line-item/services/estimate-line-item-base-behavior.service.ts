import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import {IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import {Injectable} from '@angular/core';
@Injectable({
    providedIn: 'root'
})
export abstract class IEstimateLineItemBaseBehaviorService<T extends IEstLineItemEntity> implements IEntityContainerBehavior<IGridContainerLink<T>, T> {
    public onCreate(containerLink: IGridContainerLink<T>): void {
        this.customizeToolbar(containerLink);
    }
    private customizeToolbar(containerLink: IGridContainerLink<T>) {
        containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete']);
    }
}