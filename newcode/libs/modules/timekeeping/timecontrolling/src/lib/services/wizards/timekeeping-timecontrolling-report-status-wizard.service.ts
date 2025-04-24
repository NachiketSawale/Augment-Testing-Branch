/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BasicsSharedChangeStatusService, IStatusChangeOptions } from '@libs/basics/shared';
import { IReportEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingTimeControllingReportDataService } from '../timekeeping-time-controlling-report-data.service';
import { ControllingReportComplete } from '../../model/entities/controlling-report-complete.class';

@Injectable({
	providedIn: 'root'
})
export class TimekeepingTimecontrollingReportStatusWizardService extends BasicsSharedChangeStatusService<IReportEntity, IReportEntity, ControllingReportComplete>{
	protected readonly dataService = inject(TimekeepingTimeControllingReportDataService);
	protected statusConfiguration: IStatusChangeOptions<IReportEntity, ControllingReportComplete> = {
		title: 'basics.customize.timekeepingreportstatus',
		guid: '67e70baabc0a4dedba0d499020078aa0',
		isSimpleStatus: false,
		statusName: 'recordingreportstatus',
		checkAccessRight: true,
		statusField: 'ReportStatusFk',
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