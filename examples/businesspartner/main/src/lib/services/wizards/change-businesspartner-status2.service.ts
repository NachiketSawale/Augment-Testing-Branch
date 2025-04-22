/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {BasicsSharedChangeStatusService, IStatusChangeOptions} from '@libs/basics/shared';
import {BusinesspartnerMainHeaderDataService} from '../businesspartner-data.service';
import {IBusinessPartnerEntity} from '@libs/businesspartner/interfaces';
import { BusinessPartnerEntityComplete } from '../../model/entities/businesspartner-entity-complete.class';

@Injectable({
	providedIn: 'root'
})
export class ChangeBusinessPartnerStatus2Service extends BasicsSharedChangeStatusService<IBusinessPartnerEntity, IBusinessPartnerEntity, BusinessPartnerEntityComplete> {
	protected readonly dataService = inject(BusinesspartnerMainHeaderDataService);

	protected statusConfiguration: IStatusChangeOptions<IBusinessPartnerEntity, BusinessPartnerEntityComplete> = {
		title: 'businesspartner.main.status2Title',
		guid: 'E223080E105242DAA26AC5D82F74EC51',
		isSimpleStatus: false,
		statusName: 'businesspartner2',
		checkAccessRight: true,
		statusField: 'BusinessPartnerStatus2Fk',
		updateUrl: 'businesspartner/main/businesspartnermain/change2status',
		rootDataService: this.dataService
	};

	public onStartChangeStatusWizard() {
		this.startChangeStatusWizard();
	}

	public override afterStatusChanged() {
		this.dataService.refreshSelected ? this.dataService.refreshSelected() : this.dataService.refreshAll();
	}
}