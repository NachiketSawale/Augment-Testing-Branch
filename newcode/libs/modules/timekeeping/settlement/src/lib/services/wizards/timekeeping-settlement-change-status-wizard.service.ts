/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BasicsSharedChangeStatusService, IStatusChangeOptions } from '@libs/basics/shared';
import { TimekeepingSettlementDataService } from '../timekeeping-settlement-data.service';
import { ITimekeepingSettlementComplete } from '../../model/timekeeping-settlement-complete.class';
import { ITimekeepingSettlementEntity } from '@libs/timekeeping/interfaces';

@Injectable({
	providedIn: 'root'
})
export class TimekeepingSettlementStatusWizardService extends BasicsSharedChangeStatusService<ITimekeepingSettlementEntity, ITimekeepingSettlementEntity, ITimekeepingSettlementComplete>{

	protected readonly dataService = inject(TimekeepingSettlementDataService);

	protected statusConfiguration: IStatusChangeOptions<ITimekeepingSettlementEntity, ITimekeepingSettlementComplete> = {
		title: 'timekeeping.settlement.timekeepingSettlementStatusWizard',
		guid: '543cf5918f2b4fb0b9b0547c0aee7f02',
		isSimpleStatus: false,
		statusName: 'timekeepingsettlementstatus',
		checkAccessRight: true,
		statusField: 'SettlementStatusFK',
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