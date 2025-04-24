/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BasicsSharedChangeStatusService, IStatusChangeOptions } from '@libs/basics/shared';
import { IRecordingEntity, IReportEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingRecordingReportDataService } from '../timekeeping-recording-report-data.service';
import { TimekeepingRecordingComplete } from '../../model/timekeeping-recording-complete.class';
import { TimekeepingRecordingDataService } from '../timekeeping-recording-data.service';

@Injectable({
	providedIn: 'root'
})
export class TimekeepingRecordingReportStatusWizardService extends BasicsSharedChangeStatusService<IReportEntity, IRecordingEntity, TimekeepingRecordingComplete>{

	protected readonly dataService = inject(TimekeepingRecordingReportDataService);
	protected readonly rootDataService = inject(TimekeepingRecordingDataService);

	protected statusConfiguration: IStatusChangeOptions<IRecordingEntity, TimekeepingRecordingComplete> = {
		title: 'basics.customize.timekeepingreportstatus',
		guid: '67e70baabc0a4dedba0d499020078aa0',
		isSimpleStatus: false,
		statusName: 'recordingreportstatus',
		checkAccessRight: true,
		statusField: 'ReportStatusFk',
		updateUrl: '',
		rootDataService: this.rootDataService
	};

	public onStartChangeStatusWizard() {
		this.startChangeStatusWizard();
	}

	public override afterStatusChanged() {
		//this.dataService.refreshSelected ? this.dataService.refreshSelected() : this.dataService.refreshAll();
	}
}