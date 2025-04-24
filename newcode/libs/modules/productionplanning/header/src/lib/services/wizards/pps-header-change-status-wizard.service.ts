/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BasicsSharedChangeStatusService, IStatusChangeOptions } from '@libs/basics/shared';

import { IPpsHeaderEntity } from '@libs/productionplanning/shared';
import { PpsHeaderComplete } from '../../model/pps-header-complete.class';
import { PpsHeaderDataService } from '../pps-header-data.service';


@Injectable({
	providedIn: 'root'
})
export class PpsHeaderChangeStatusWizardService extends BasicsSharedChangeStatusService<IPpsHeaderEntity, IPpsHeaderEntity, PpsHeaderComplete> {
	protected readonly dataService = inject(PpsHeaderDataService);

	protected statusConfiguration: IStatusChangeOptions<IPpsHeaderEntity, PpsHeaderComplete> = {
		title: 'Headerionplanning.Header.wizard.changeHeaderStatusTitle',
		guid: 'a7905833028a4766bdc95cc3549035f8',
		isSimpleStatus: true,
		statusName: 'productionplanningheader',
		checkAccessRight: true,
		statusField: 'HeaderStatusFk',
		rootDataService: this.dataService
	};

	public onStartChangeStatusWizard() {
		this.startChangeStatusWizard();
	}

	public override afterStatusChanged() {
		this.dataService.refreshSelected ? this.dataService.refreshSelected() : this.dataService.refreshAll();
	}
}