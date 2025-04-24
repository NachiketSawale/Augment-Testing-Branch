/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IMdcContrChartEntity } from '../model/entities/mdc-contr-chart-entity.interface';
import { ControllingConfigurationChartDataService } from '../services/controlling-configuration-chart-data.service';


@Injectable({
    providedIn: 'root'
})
export class ControllingConfigurationChartBehavior implements IEntityContainerBehavior<IGridContainerLink<IMdcContrChartEntity>, IMdcContrChartEntity> {

    private readonly dataService = inject(ControllingConfigurationChartDataService);

    public onCreate(containerLink: IGridContainerLink<IMdcContrChartEntity>) {
        this.dataService.refreshAllLoaded().then();
		  this.dataService.closeChartDialog();

        const subscription = this.dataService.selectionChanged$.subscribe(()=>{
            const entity = this.dataService.getSelectedEntity();
            if(entity) {
                this.dataService.openChartDialog(entity);
            }
        });

        containerLink.registerSubscription(subscription);
    }
}