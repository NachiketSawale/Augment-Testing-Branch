import {IControllingCommonPrcContractEntity} from '../model/entities/controlling-common-prc-contract-entity.interface';
import {CompleteIdentification} from '@libs/platform/common';
import {IControllingCommonProjectEntity} from '../model/entities/controlling-common-project-entity.interface';
import {Injectable} from '@angular/core';
import {ControllingCommonPrcContractDataService} from '../services/controlling-common-prc-contract-data.service';
import {IGridContainerLink} from '@libs/ui/business-base';
@Injectable({
    providedIn: 'root'
})
export class ControllingCommonPrcContractBehaviorService<T extends IControllingCommonPrcContractEntity, PT extends IControllingCommonProjectEntity,PU extends CompleteIdentification<PT>>{
    public constructor(public dataService: ControllingCommonPrcContractDataService<T,PT,PU>) {

    }
    public onCreate(containerLink: IGridContainerLink<T>): void {
        this.customizeToolbar(containerLink);
    }

    private customizeToolbar(containerLink: IGridContainerLink<T>) {
        containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete']);
    }
}