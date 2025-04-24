
import { Injectable } from '@angular/core';
import {IControllingCommonProjectEntity} from '../model/entities/controlling-common-project-entity.interface';
import {IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';

import {ControllingCommonProjectDataService} from '../services/controlling-common-project-data.service';
import {CompleteIdentification} from '@libs/platform/common';

@Injectable({
    providedIn: 'root'
})


export class ControllingCommonProjectBehavior<T extends IControllingCommonProjectEntity, U extends CompleteIdentification<T>> implements IEntityContainerBehavior<IGridContainerLink<T>, T> {
    
    public constructor(public dataService: ControllingCommonProjectDataService<T, U>) {

    }

    public onCreate(containerLink: IGridContainerLink<T>): void {
        this.customizeToolbar(containerLink);
    }

    private customizeToolbar(containerLink: IGridContainerLink<T>) {
        containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete']);
    }
}