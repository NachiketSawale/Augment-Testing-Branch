/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable, inject} from '@angular/core';
import {
    BasicsSharedChangeStatusService,
    IStatusChangeOptions,
    StatusIdentificationData
} from '@libs/basics/shared';

import {IPesHeaderEntity} from '../model/entities/pes-header-entity.interface';
import { ProcurementPesHeaderDataService } from '../services/procurement-pes-header-data.service';
import { PesCompleteNew } from '../model/complete-class/pes-complete-new.class';

// eslint-disable-next-line angular-file-naming/service-filename-suffix
@Injectable({
    providedIn: 'root'
})
export class ProcurementPesChangeStatusWizardService extends BasicsSharedChangeStatusService<IPesHeaderEntity, IPesHeaderEntity, PesCompleteNew> {


    /**
     * specify ProcurementPesHeaderDataService dataservice
     */
    protected readonly dataService = inject(ProcurementPesHeaderDataService);
    /**
     * specify configuration settings for wizard
     */
    protected readonly statusConfiguration: IStatusChangeOptions<IPesHeaderEntity, PesCompleteNew> = {
        title: 'procurement.pes.wizard.change.statusTitle',
        isSimpleStatus: false,
        statusName: 'pes',
        checkAccessRight: true,
        statusField: 'PesStatusFk',
        updateUrl: 'procurement/pes/wizard/changestatus',
	     rootDataService: this.dataService
    };
    /**
     * specify onStartChangeStatusWizard function
     */
    public onStartChangeStatusWizard() {
        this.startChangeStatusWizard();
    }

    /**
     * specify convertToStatusIdentification function
     * @param selection
     * @returns
     */
    public override convertToStatusIdentification(selection: IPesHeaderEntity[]): StatusIdentificationData[] {
        return selection.map(item => {
            return {
                id: item.Id,
                projectId: item.ProjectFk ?? undefined
            };
        });
    }

    /**
     * specify afterStatusChanged function
     */
    public override afterStatusChanged() {
        this.dataService.refreshSelected ? this.dataService.refreshSelected() : this.dataService.refreshAll();
    }

}