/*
 * Copyright(c) RIB Software GmbH
 */
import {IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import {Injectable} from '@angular/core';
@Injectable({
    providedIn: 'root',
})
export class ProcurementCommonItemInfoBlGridBehavior<IPrcItemInfoBLEntity extends object> implements IEntityContainerBehavior<IGridContainerLink<IPrcItemInfoBLEntity>, IPrcItemInfoBLEntity>{

    public constructor() {
    }

    public onCreate(containerLink: IGridContainerLink<IPrcItemInfoBLEntity>): void {
        containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete']);
    }

}