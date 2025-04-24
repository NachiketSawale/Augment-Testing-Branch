/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { TimekeepingRecordingReportDataService } from '../timekeeping-recording-report-data.service';
import { TimekeepingRecordingResultDataService } from '../timekeeping-recording-result-data.service';
import { IReportEntity, ITimekeepingResultEntity } from '@libs/timekeeping/interfaces';

@Injectable({
	providedIn: 'root'
})
export class TimekeepingRecordingUnlockTransactionWizardService {
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly reportdataService = inject(TimekeepingRecordingReportDataService);
	private readonly resultdataService = inject(TimekeepingRecordingResultDataService);

	public unlockUsedForTransaction() {
		const results = this.resultdataService.getSelection();
		const reports = this.reportdataService.getSelection();

		if (results.length == 0 && reports.length == 0) {
			this.messageBoxService.showInfoBox('Please select a record first', 'info', true);
			return;
		} else {
			let modifyResult = false;
			let modifyReport = false;
			const unlockItems = (list: (ITimekeepingResultEntity | IReportEntity)[], dataService: (TimekeepingRecordingReportDataService | TimekeepingRecordingResultDataService)) => {
				if (list && list.length > 0) {
					list.forEach(item => {
						item.UsedForTransaction = false;
						dataService.setModified(item);
						modifyResult = modifyReport = true;
					});
				}
			};
			unlockItems(reports, this.reportdataService);
			unlockItems(results, this.resultdataService);

			if (modifyResult || modifyReport) {
				this.messageBoxService.showInfoBox('Records Unlocked Successfully.', 'info', true);
			}
		}

	}

}
