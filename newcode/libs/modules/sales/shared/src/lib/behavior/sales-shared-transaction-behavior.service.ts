import { Injectable } from '@angular/core';
import {IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';

@Injectable({
    providedIn: 'root'
})
export class SalesSharedTransactionBehavior implements IEntityContainerBehavior<IGridContainerLink<object>, object> {
    public onCreate(containerLink: IGridContainerLink<object>): void {
        containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete', 'createChild']);
    }
}