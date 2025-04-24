import {IControllingCommonPesEntity} from '../model/entities/controlling-common-pes-entity.interface';
import {CompleteIdentification} from '@libs/platform/common';
import {ControllingCommonPesDataService} from '../services/controlling-common-pes-data.service';
import {Injectable} from '@angular/core';
import {IGridContainerLink} from '@libs/ui/business-base';



@Injectable({
    providedIn: 'root'
})
export class ControllingCommonPesBehaviorService<T extends IControllingCommonPesEntity,PT extends object,PU extends CompleteIdentification<PT>>{
    
    public dataService: ControllingCommonPesDataService<T,PT,PU>;

    public constructor(dataService: ControllingCommonPesDataService<T,PT,PU>) {
        this.dataService = dataService;
    }

    public onCreate(containerLink: IGridContainerLink<T>): void {
        const dataSub = this.dataService.listChanged$.subscribe(data => {
            containerLink.gridData = data;
        });
        containerLink.registerSubscription(dataSub);
        this.customizeToolbar(containerLink);
    }

    private customizeToolbar(containerLink: IGridContainerLink<T>) {
        containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete']);
    }

}