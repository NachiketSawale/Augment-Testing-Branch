
import { Injectable } from '@angular/core';
import {IControllingCommonProjectEntity} from '../model/entities/controlling-common-project-entity.interface';
import {IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import {CompleteIdentification} from '@libs/platform/common';
import { ControllingCommonVersionDataService } from '../services/controlling-common-version-data.service';
import { IControllingCommonBisPrjHistoryEntity } from '../model/entities/controlling-common-bis-prj-history-entity.interface';

@Injectable({
    providedIn: 'root'
})


export class ControllingCommonVersionBehaviorService <T extends IControllingCommonBisPrjHistoryEntity,  PT extends IControllingCommonProjectEntity,PU extends CompleteIdentification<PT>> implements IEntityContainerBehavior<IGridContainerLink<T>, T> {

    public constructor(public dataService: ControllingCommonVersionDataService<T,PT,PU>) {

    }

    public onCreate(containerLink: IGridContainerLink<T>): void {
        this.customizeToolbar(containerLink);
    }

    private customizeToolbar(containerLink: IGridContainerLink<T>) {
        containerLink.uiAddOns.toolbar.deleteItems(['create']);
    }
}