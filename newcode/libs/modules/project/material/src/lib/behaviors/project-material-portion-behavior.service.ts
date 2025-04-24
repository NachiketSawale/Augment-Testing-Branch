/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import  {IEntityContainerBehavior, IGridContainerLink}  from '@libs/ui/business-base';
import {IProjectMaterialPortionEntity} from './../model/entities/prj-material-portion-entity.interface';

@Injectable({
    providedIn: 'root',
})
export class ProjectMaterialPortionBehavior implements IEntityContainerBehavior<IGridContainerLink<IProjectMaterialPortionEntity>, IProjectMaterialPortionEntity> {

    public onCreate(containerLink: IGridContainerLink<IProjectMaterialPortionEntity>): void {
        this.addItemsToToolbar(containerLink);
    }

    private addItemsToToolbar(containerLink: IGridContainerLink<IProjectMaterialPortionEntity>) {
        containerLink.uiAddOns.toolbar.deleteItems(['create','delete']);
    }
}