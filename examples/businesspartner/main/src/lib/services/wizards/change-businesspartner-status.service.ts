/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {BasicsSharedChangeStatusService, IStatusChangeOptions} from '@libs/basics/shared';
import {BusinesspartnerMainHeaderDataService} from '../../services/businesspartner-data.service';
import {IBusinessPartnerEntity} from '@libs/businesspartner/interfaces';
import { BusinessPartnerEntityComplete } from '../../model/entities/businesspartner-entity-complete.class';

@Injectable({
	providedIn: 'root'
})
export class ChangeBusinessPartnerStatusService extends BasicsSharedChangeStatusService<IBusinessPartnerEntity, IBusinessPartnerEntity, BusinessPartnerEntityComplete> {
	protected readonly dataService = inject(BusinesspartnerMainHeaderDataService);

	protected statusConfiguration: IStatusChangeOptions<IBusinessPartnerEntity, BusinessPartnerEntityComplete> = {
		title: 'Change Business Partner Status',
		guid: '882fa2cd388a48a6959a57efa46bf0d8',
		isSimpleStatus: false,
		statusName: 'businesspartner',
		checkAccessRight: true,
		statusField: 'BusinessPartnerStatusFk',
		updateUrl: 'businesspartner/main/businesspartnermain/changestatus',
		rootDataService: this.dataService
	};

	public onStartChangeStatusWizard() {
		this.startChangeStatusWizard();
	}

	public override afterStatusChanged() {
		this.dataService.refreshSelected ? this.dataService.refreshSelected() : this.dataService.refreshAll();
	}
}