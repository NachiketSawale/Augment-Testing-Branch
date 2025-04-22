/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {BasicsSharedChangeStatusService, IStatusChangeOptions} from '@libs/basics/shared';
import {BusinessPartnerMainSubsidiaryDataService} from '../../services/subsidiary-data.service';
import { IBusinessPartnerEntity, ISubsidiaryEntity } from '@libs/businesspartner/interfaces';
import { BusinesspartnerMainHeaderDataService } from '../businesspartner-data.service';
import { BusinessPartnerEntityComplete } from '../../model/entities/businesspartner-entity-complete.class';

@Injectable({
	providedIn: 'root'
})
export class ChangeSubsidiaryStatusService extends BasicsSharedChangeStatusService<ISubsidiaryEntity, IBusinessPartnerEntity, BusinessPartnerEntityComplete> {
	protected readonly dataService = inject(BusinessPartnerMainSubsidiaryDataService);
	protected readonly rootDataService = inject(BusinesspartnerMainHeaderDataService);

	protected statusConfiguration: IStatusChangeOptions<IBusinessPartnerEntity, BusinessPartnerEntityComplete> = {
		title: 'Change Subsidiary Status',
		guid: '882FA2CD388A48A6959A57EFA46BF0D8',
		isSimpleStatus: false,
		statusName: 'subsidiary',
		checkAccessRight: true,
		statusField: 'SubsidiaryStatusFk',
		updateUrl: 'businesspartner/main/businesspartnermain/changesubsidiarystatus',
		rootDataService: this.rootDataService
	};

	public onStartChangeStatusWizard() {
		this.startChangeStatusWizard();
	}

	public override afterStatusChanged() {
		//TODO: only refresh the selected entities not support yet. wait framework done
	}
}