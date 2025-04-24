/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BasicsSharedChangeStatusService, IStatusChangeOptions } from '@libs/basics/shared';
import { IRecordingEntity, ITimekeepingResultEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingRecordingResultDataService } from '../timekeeping-recording-result-data.service';
import { TimekeepingRecordingComplete } from '../../model/timekeeping-recording-complete.class';
import { TimekeepingRecordingDataService } from '../timekeeping-recording-data.service';

@Injectable({
	providedIn: 'root'
})
export class TimekeepingRecordingResultStatusWizardService extends BasicsSharedChangeStatusService<ITimekeepingResultEntity, IRecordingEntity, TimekeepingRecordingComplete>{

	protected readonly dataService = inject(TimekeepingRecordingResultDataService);
	protected readonly rootDataService = inject(TimekeepingRecordingDataService);

	protected statusConfiguration: IStatusChangeOptions<IRecordingEntity, TimekeepingRecordingComplete> = {
		title: 'basics.customize.timekeepingresultstatus',
		guid: 'ed0025985a164543914136124b9fa81a',
		isSimpleStatus: false,
		statusName: 'timekeepingresultstatus',
		checkAccessRight: true,
		statusField: 'ResultStatusFk',
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