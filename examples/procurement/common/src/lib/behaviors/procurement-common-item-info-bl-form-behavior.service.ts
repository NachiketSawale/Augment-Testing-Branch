/*
 * Copyright(c) RIB Software GmbH
 */
import {IEntityContainerBehavior, IFormContainerLink} from '@libs/ui/business-base';
import {Injectable} from '@angular/core';
@Injectable({
    providedIn: 'root',
})
export class ProcurementCommonItemInfoBlFormBehavior<IPrcItemInfoBLEntity extends object> implements IEntityContainerBehavior<IFormContainerLink<IPrcItemInfoBLEntity>, IPrcItemInfoBLEntity>{

    public constructor() {
    }

    public onCreate(containerLink: IFormContainerLink<IPrcItemInfoBLEntity>): void {
        containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete']);
    }

}