/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import  {IEntityContainerBehavior, IGridContainerLink}  from '@libs/ui/business-base';

import  { ConcreteMenuItem, ItemType} from '@libs/ui/common';
import {IPrjMaterialEntity} from '@libs/project/interfaces';

export const PROJECT_MATERIAL_BEHAVIOR_TOKEN = new InjectionToken<ProjectMaterialBehavior>('projectMaterialBehavior');


@Injectable({
    providedIn: 'root',
})
export class ProjectMaterialBehavior implements IEntityContainerBehavior<IGridContainerLink<IPrjMaterialEntity>, IPrjMaterialEntity> {

    public onCreate(containerLink: IGridContainerLink<IPrjMaterialEntity>): void {
       // this.addItemsToToolbar(containerLink);
    }

    private addItemsToToolbar(containerLink: IGridContainerLink<IPrjMaterialEntity>) {
        const customToolbarItems: ConcreteMenuItem[] = [
            {
                caption: { key: 'cloud.common.toolbarInsertSub' },
                iconClass: 'tlb-icons ico-sub-fld-new',
                type: ItemType.Item,
                //fn: () => TODO: toolbarInsertSub click functionality
            },
        ];

        containerLink.uiAddOns.toolbar.addItems(customToolbarItems);
    }
}