/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BasicsSharedChangeStatusService, IStatusChangeOptions } from '@libs/basics/shared';
import { ProcurementPesItemDataService } from '../services/procurement-pes-item-data.service';
import { IPesItemEntity } from '../model/entities/pes-item-entity.interface';
import { PesItemComplete } from '../model/complete-class/pes-item-complete.class';
import { IPesHeaderEntity } from '../model/entities/pes-header-entity.interface';
import { ProcurementPesHeaderDataService } from '../services/procurement-pes-header-data.service';

@Injectable({
    providedIn: 'root',
})

/**
 * Procurement pes prc Item Project Change Status Wizard Service.
 */
export class ProcurementPesPrcItemProjectChangeStatusWizardService extends BasicsSharedChangeStatusService<IPesItemEntity, IPesHeaderEntity, PesItemComplete> {
    protected readonly dataService = inject(ProcurementPesItemDataService);
    protected readonly rootDataService = inject(ProcurementPesHeaderDataService);

    protected statusConfiguration: IStatusChangeOptions<IPesHeaderEntity, PesItemComplete> = {
        title: 'Change Project Change Status', //todo - translation not available in procurement
        guid: '7b01d23693a6429fac42ee96245e8967',
        isSimpleStatus: true,
        statusName: 'prcitemprojectchange',
        checkAccessRight: true,
        statusField: 'PrjChangeStatusFk',
        rootDataService: this.rootDataService
    };

    public startChangePesItemProjectChangeStatusWizard() {
        this.startChangeStatusWizard();
    }

    public override async beforeStatusChanged(): Promise<boolean> {
        const selectedItem = this.dataService.getSelectedEntity();
        if(!selectedItem || selectedItem.PrjChangeFk === null){
            await this.messageBoxService.showInfoBox('basics.common.noProjectChangeAssigned', 'info', true);
			return false;
        }else{
            return true;
        }
	}

    public override afterStatusChanged() {
        this.rootDataService.refreshSelected ? this.rootDataService.refreshSelected() : this.rootDataService.refreshAll();
    }
}
