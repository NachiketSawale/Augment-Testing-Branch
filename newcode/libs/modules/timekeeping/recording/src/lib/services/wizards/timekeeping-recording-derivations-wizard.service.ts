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
export class TimekeepingRecordingDerivationsWizardService {
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly recordingdataService = inject(TimekeepingRecordingDataService);
	private readonly sheetdataService = inject(TimekeepingRecordingSheetDataService);
	private readonly http = inject(PlatformHttpService);

	public calculateOtherDerivations() {
		const recordings: IRecordingEntity[] = this.recordingdataService.getSelection();
		const recordingIds: number[] = recordings.map(recording => recording.Id);
		const sheets: ISheetEntity[] = this.sheetdataService.getSelection();
		const sheetsIds: number[] = sheets.map(sheet => sheet.Id);
		const sendIdData = {sheets: sheetsIds, recordings: recordingIds};

		interface calculateReturnType {
			newEntities: IReportEntity[],
			faultyEmployeeList: string[],
			message: string;
		}
		this.http.post$<calculateReturnType>('timekeeping/recording/sheet/calculateOtherDerivations', sendIdData).subscribe({
			next: (response: calculateReturnType) => {
				if (response && response.newEntities) {
					if (response.newEntities.length > 0) {
						this.messageBoxService.showInfoBox('timekeeping.recording.reportNewRecordWizard', 'info', true);
					} else {
						this.messageBoxService.showInfoBox('timekeeping.recording.reportNoNewRecordWizard', 'info', true);
					}
				} else {
					this.messageBoxService.showInfoBox(response.message, 'info', true);
				}
			}
		});
	}
}
