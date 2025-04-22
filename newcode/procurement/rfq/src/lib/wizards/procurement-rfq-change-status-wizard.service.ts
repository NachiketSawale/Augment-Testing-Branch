/*
 * Copyright(c) RIB Software GmbH
 */
import {inject, Injectable} from '@angular/core';
import {BasicsSharedChangeStatusService, IStatusChangeOptions} from '@libs/basics/shared';
import { ProcurementRfqHeaderMainDataService } from '../services/procurement-rfq-header-main-data.service';
import { IRfqHeaderEntity } from '@libs/procurement/interfaces';
import { RfqHeaderEntityComplete } from '../model/entities/rfq-header-entity-complete.class';
@Injectable({
	providedIn: 'root'
})
/**
 * Change Status for Rfq wizard service
 */
export class ProcurementRfqChangeStatusWizardService extends BasicsSharedChangeStatusService<IRfqHeaderEntity, IRfqHeaderEntity, RfqHeaderEntityComplete> {
    protected readonly dataService = inject(ProcurementRfqHeaderMainDataService);
	protected statusConfiguration: IStatusChangeOptions<IRfqHeaderEntity, RfqHeaderEntityComplete> = {
		title: 'procurement.rfq.wizard.change.status',
		guid: '8c835f6c71584346922221eb754b7944',
		isSimpleStatus: false,
		statusName: 'rfq',
		checkAccessRight: true,
		statusField: 'RfqStatusFk',
		updateUrl: 'procurement/rfq/wizard/changerfqstatus',
		rootDataService: this.dataService
        //TODO: projectField: 'ProjectFk',
	};
	public onStartChangeStatusWizard() {
		this.startChangeStatusWizard();
	}

	public override afterStatusChanged() {
        this.dataService.refreshSelected ? this.dataService.refreshSelected() : this.dataService.refreshAll();
	}
}