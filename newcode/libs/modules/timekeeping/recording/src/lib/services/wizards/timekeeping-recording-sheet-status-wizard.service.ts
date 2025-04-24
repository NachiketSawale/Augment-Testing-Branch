/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BasicsSharedChangeStatusService, IStatusChangeOptions } from '@libs/basics/shared';
import { IRecordingEntity, ISheetEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingRecordingSheetDataService } from '../timekeeping-recording-sheet-data.service';
import { TimekeepingRecordingComplete } from '../../model/timekeeping-recording-complete.class';
import { TimekeepingRecordingDataService } from '../timekeeping-recording-data.service';

@Injectable({
	providedIn: 'root'
})
export class TimekeepingRecordingSheetStatusWizardService extends BasicsSharedChangeStatusService<ISheetEntity, IRecordingEntity, TimekeepingRecordingComplete>{

	protected readonly dataService = inject(TimekeepingRecordingSheetDataService);
	protected readonly rootDataService = inject(TimekeepingRecordingDataService);

	protected statusConfiguration: IStatusChangeOptions<IRecordingEntity, TimekeepingRecordingComplete> = {
		title: 'basics.customize.timekeepingsheetstatus',
		guid: 'e25cba20c7c84b44a55734cb439d6e90',
		isSimpleStatus: false,
		statusName: 'timekeepingsheetstatus',
		checkAccessRight: true,
		statusField: 'SheetStatusFk',
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