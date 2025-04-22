/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BasicsSharedChangeStatusService, IStatusChangeOptions } from '@libs/basics/shared';
import { BusinessPartnerBankDataService } from '../businesspartner-bank-data.service';
import { BusinesspartnerMainHeaderDataService } from '../businesspartner-data.service';
import { IBusinessPartnerBankEntity, IBusinessPartnerEntity } from '@libs/businesspartner/interfaces';
import { BusinessPartnerEntityComplete } from '../../model/entities/businesspartner-entity-complete.class';

@Injectable({
	providedIn: 'root'
})
/**
 * Change Bank status service
 */
export class ChangeBankStatusService extends BasicsSharedChangeStatusService<IBusinessPartnerBankEntity, IBusinessPartnerEntity, BusinessPartnerEntityComplete>{

	protected readonly dataService = inject(BusinessPartnerBankDataService);
	protected readonly rootDataService = inject(BusinesspartnerMainHeaderDataService);


	protected statusConfiguration: IStatusChangeOptions<IBusinessPartnerEntity, BusinessPartnerEntityComplete> = {
		title: 'businesspartner.main.changeBankStatusTitle',
		guid: '8c8066ad189742d8b5cd1f65f1891615',
		isSimpleStatus: false,
		statusName: 'bpdbank',
		checkAccessRight: true,
		statusField: 'BpdBankStatusFk',
		updateUrl: 'businesspartner/main/businesspartnermain/changebanktatus',
		rootDataService: this.rootDataService
	};

	public onStartChangeStatusWizard() {
		this.startChangeStatusWizard();
	}

	public override afterStatusChanged() {
		//TODO: only refresh the selected entities not support yet.
	}
}