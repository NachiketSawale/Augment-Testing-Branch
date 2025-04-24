/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BasicsSharedChangeStatusService, IStatusChangeOptions } from '@libs/basics/shared';
import { ILogisticCardEntity } from '@libs/logistic/interfaces';
import { LogisticCardDataService } from '../logistic-card-data.service';
import { LogisticCardComplete } from '../../model/logistic-card-complete.class';

@Injectable({
	providedIn: 'root'
})
export class LogisticCardWizardService extends BasicsSharedChangeStatusService<ILogisticCardEntity, ILogisticCardEntity, LogisticCardComplete>{

	protected readonly dataService = inject(LogisticCardDataService);

	protected statusConfiguration: IStatusChangeOptions<ILogisticCardEntity, LogisticCardComplete> = {
		title: 'logistic.card.changeStatus',
		guid: 'db22cbc273704edfb9cd9c28cf6d40b6',
		isSimpleStatus: false,
		statusName: 'logisticcardstatus',
		checkAccessRight: true,
		statusField: 'JobCardStatusFk',
		updateUrl: '',
		rootDataService: this.dataService
	};

	public onStartChangeStatusWizard() {
		this.startChangeStatusWizard();
	}

	public override afterStatusChanged() {
		this.dataService.refreshSelected ? this.dataService.refreshSelected() : this.dataService.refreshAll();
	}
}