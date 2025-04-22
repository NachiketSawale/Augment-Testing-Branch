/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import {BasicsSharedChangeStatusService, IStatusChangeOptions} from '@libs/basics/shared';
import { ProcurementPesSelfbillingDetailDataService } from '../services/procurement-pes-selfbilling-detail-data.service';
import { IPesSelfBillingEntity } from '../model/entities/pes-self-billing-entity.interface';
import { ProcurementPesHeaderDataService } from '../services/procurement-pes-header-data.service';
import { IPesHeaderEntity } from '../model/entities';
import { PesCompleteNew } from '../model/complete-class/pes-complete-new.class';
@Injectable({
	providedIn: 'root'
})
/**
 * Change Status for pes self billing wizard service
 */
export class ProcurementPesChangeSelfBillingStatusWizardService extends BasicsSharedChangeStatusService<IPesSelfBillingEntity, IPesHeaderEntity, PesCompleteNew> {
	protected readonly dataService = inject(ProcurementPesSelfbillingDetailDataService);
	protected readonly rootDataService = inject(ProcurementPesHeaderDataService);
	protected statusConfiguration: IStatusChangeOptions<IPesHeaderEntity, PesCompleteNew> = {
		title: 'procurement.pes.wizard.selfBilling.changeSelfBillingStatus',
		guid: '7143b60f28a642eaae7f8acac57d2b2e',
		isSimpleStatus: false,
		statusName: 'SbhStatus',
		checkAccessRight: true,
		statusField: 'SbhStatusFk',
		updateUrl: 'procurement/pes/wizard/changeselfbillingstatus',
		rootDataService: this.rootDataService
	};
	public onStartChangeStatusWizard() {
		this.startChangeStatusWizard();
	}

	public override afterStatusChanged() {
       //TODO: on result getDataProcessor, processItem, setSelected, gridRefresh need to implement
	}
}