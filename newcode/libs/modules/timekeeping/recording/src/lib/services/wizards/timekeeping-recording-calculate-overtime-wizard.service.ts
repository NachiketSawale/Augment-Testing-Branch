/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { PlatformHttpService } from '@libs/platform/common';
import { TimekeepingRecordingDataService } from '../timekeeping-recording-data.service';
import { TimekeepingRecordingSheetDataService } from '../timekeeping-recording-sheet-data.service';
import { IRecordingEntity, IReportEntity, ISheetEntity } from '@libs/timekeeping/interfaces';

@Injectable({
	providedIn: 'root'
})
export class TimekeepingRecordingCalculateOvertimeWizard {
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly recordingdataService = inject(TimekeepingRecordingDataService);
	private readonly sheetdataService = inject(TimekeepingRecordingSheetDataService);
	private readonly http = inject(PlatformHttpService);

	public calculateOvertime() {
		const recordings: IRecordingEntity[] = this.recordingdataService.getSelection();
		const recordingIds: number[] = recordings.map(recording => recording.Id);

		const sheets: ISheetEntity[] = this.sheetdataService.getSelection();
		const sheetsIds: number[] = sheets.map(sheet => sheet.Id);
		const sendIdData = {sheets: sheetsIds, recordings: recordingIds};
		const httpRoute = 'timekeeping/recording/sheet/calculateOvertime';

		interface calculateReturnType {
			newEntities: IReportEntity[],
			faultyEmployeeList: string[],
			message: string;
		}

		this.http.post$<calculateReturnType>(httpRoute, sendIdData).subscribe({
			next: (response: calculateReturnType) => {
				const message: string = response.faultyEmployeeList.length > 0 && typeof response.faultyEmployeeList[0] === 'string'
					? response.faultyEmployeeList[0]
					: '';
				if (response && response.newEntities) {
					if (response.newEntities.length > 0) {
						this.messageBoxService.showInfoBox('timekeeping.recording.reportNewRecordWizard', 'info', true);
						if (response && response.faultyEmployeeList && response.faultyEmployeeList.length > 0) {
							this.messageBoxService.showInfoBox(message, 'info', true);
						}
					} else {
						this.messageBoxService.showInfoBox('timekeeping.recording.reportNoNewRecordWizard', 'info', true);
						if (response.faultyEmployeeList.length > 0) {
							this.messageBoxService.showInfoBox(message, 'info', true);
						}
					}
				} else {
					this.messageBoxService.showInfoBox(response.message, 'info', true);
					if (response.faultyEmployeeList.length > 0) {
						this.messageBoxService.showInfoBox(message, 'info', true);
					}
				}
			}
		});
	}
}
