/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BasicsSharedChangeStatusService, IStatusChangeOptions } from '@libs/basics/shared';
import { IRecordingEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingRecordingDataService } from '../timekeeping-recording-data.service';
import { TimekeepingRecordingComplete } from '../../model/timekeeping-recording-complete.class';

@Injectable({
	providedIn: 'root'
})
export class TimekeepingRecordingWizardService extends BasicsSharedChangeStatusService<IRecordingEntity, IRecordingEntity, TimekeepingRecordingComplete>{

	protected readonly dataService = inject(TimekeepingRecordingDataService);

	protected statusConfiguration: IStatusChangeOptions<IRecordingEntity, TimekeepingRecordingComplete> = {
		title: 'basics.customize.timekeepingrecordingstatus',
		guid: '4833891d71fb4b978c8f5c8310c36450',
		isSimpleStatus: false,
		statusName: 'timekeepingrecordingstatus',
		checkAccessRight: true,
		statusField: 'RecordingStatusFk',
		updateUrl: '',
		rootDataService: this.dataService,
	};

	public onStartChangeStatusWizard() {
		this.startChangeStatusWizard();
	}

	public override afterStatusChanged() {
		this.dataService.refreshSelected ? this.dataService.refreshSelected() : this.dataService.refreshAll();
	}
}