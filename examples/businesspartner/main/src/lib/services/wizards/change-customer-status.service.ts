/*
 * Copyright(c) RIB Software GmbH
 */
import {inject, Injectable} from '@angular/core';
import {BasicsSharedChangeStatusService, IStatusChangeOptions} from '@libs/basics/shared';
import { BusinesspartnerMainCustomerDataService } from '../customer-data.service';
import { BusinesspartnerMainHeaderDataService } from '../businesspartner-data.service';
import { IBusinessPartnerEntity, ICustomerEntity } from '@libs/businesspartner/interfaces';
import { BusinessPartnerEntityComplete } from '../../model/entities/businesspartner-entity-complete.class';

@Injectable({
	providedIn: 'root'
})
/**
 * Change Customer Status wizard service
 */
export class ChangeCustomerStatusService extends BasicsSharedChangeStatusService<ICustomerEntity, IBusinessPartnerEntity, BusinessPartnerEntityComplete> {
	protected readonly dataService = inject(BusinesspartnerMainCustomerDataService);
	protected readonly rootDataService = inject(BusinesspartnerMainHeaderDataService);

	protected statusConfiguration: IStatusChangeOptions<IBusinessPartnerEntity, BusinessPartnerEntityComplete> = {
        //TODO: projectField: 'ProjectFk', not support yet.
		title: 'businesspartner.main.customerStatusTitle',
		guid: '630721CEFE87445D997B70BF88141489',
		isSimpleStatus: false,
		statusName: 'customer',
		checkAccessRight: true,
		statusField: 'CustomerStatusFk',
		updateUrl: 'businesspartner/main/businesspartnermain/changecustomerstatus',
		rootDataService: this.rootDataService
	};

	public onStartChangeStatusWizard() {
		this.startChangeStatusWizard();
	}

	public override afterStatusChanged() {
        //TODO: only refresh the selected entities not support yet.
	}
}