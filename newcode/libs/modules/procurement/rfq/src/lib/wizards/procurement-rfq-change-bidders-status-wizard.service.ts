/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';

import { BasicsSharedChangeStatusService, IStatusChangeOptions } from '@libs/basics/shared';

import { IRfqBusinessPartnerEntity } from '../model/entities/rfq-businesspartner-entity.interface';
import { ProcurementRfqBusinessPartnerDataService } from '../services/rfq-business-partner-data.service';
import { ProcurementRfqHeaderMainDataService } from '../services/procurement-rfq-header-main-data.service';
import { IRfqHeaderEntity } from '@libs/procurement/interfaces';
import { RfqHeaderEntityComplete } from '../model/entities/rfq-header-entity-complete.class';

/**
 * Change Bidders status Wizard Service
 */

@Injectable({
	providedIn: 'root',
})
export class ProcurementRfqChangeBidderStatusWizardService extends BasicsSharedChangeStatusService<IRfqBusinessPartnerEntity, IRfqHeaderEntity, RfqHeaderEntityComplete> {
	protected readonly dataService = inject(ProcurementRfqBusinessPartnerDataService);
	protected readonly rootDataService = inject(ProcurementRfqHeaderMainDataService);

	/**
	 * Status change options
	 */
	protected readonly statusConfiguration: IStatusChangeOptions<IRfqHeaderEntity, RfqHeaderEntityComplete> = {
		title: 'procurement.rfq.wizard.change.bpstatus',
		guid: '6ef1c38241b942ef87323fa2ff4d9a60',
		isSimpleStatus: false,
		statusName: 'rfqbidder',
		checkAccessRight: true,
		statusField: 'RfqBusinesspartnerStatusFk',
		updateUrl: 'procurement/rfq/wizard/changebidderstatus',
		rootDataService: this.rootDataService
	};

	/**
	 * start change status process
	 */
	public onStartChangeStatusWizard() {
		this.startChangeStatusWizard();
	}

	/**
	 * The overrided method
	 */
	public override afterStatusChanged(): void {
		//TODO:refreshSelected not exists on dataService
	}
}
