/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { IInitializationContext, PlatformHttpService } from '@libs/platform/common';
import {IReportEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingTimeControllingReportDataService } from '../timekeeping-time-controlling-report-data.service';

interface SendIdData {
	sheets: number[];
	recordings: null;
}

interface calculateReturnType {
	newEntities: IReportEntity[],
	faultyEmployeeList: string[],
	message: string;
}

@Injectable({
	providedIn: 'root'
})
export class TimekeepingTimecontrollingDerivationsWizard {
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly reportDataService = inject(TimekeepingTimeControllingReportDataService);
	private readonly http = inject(PlatformHttpService);

	public calculateOtherDerivations(context: IInitializationContext) {
		this.doCalculation('timekeeping/recording/sheet/calculateOtherDerivations', 'timekeeping.timecontrolling.wizardCalculateDerivations');
	}

	public calculateOvertime(context: IInitializationContext) {
		this.doCalculation('timekeeping/recording/sheet/calculateOvertime','timekeeping.timecontrolling.wizardCalculateOvertime');
	}

	private doCalculation(route: string, title: string): void {
		const reports = this.reportDataService.getSelection();
		const entity = reports !== null ? reports[0] : null;

		if (this.assertSelection(entity, title)) {
			const sheetIds = reports.map(report => report.SheetFk);
			const uniqueSheetIds = Array.from(new Set(sheetIds.filter((id): id is number => id != null)));
			const sendIdData: SendIdData = { sheets: uniqueSheetIds, recordings: null };

			this.http.post$<calculateReturnType>(`${route}`, sendIdData).subscribe(response => {
				if (response && response.newEntities) {
					this.messageBoxService.showMsgBox(response.newEntities.length > 0
						? 'timekeeping.timecontrolling.newRecordGenerated'
						: 'timekeeping.timecontrolling.noNewRecordGenerated',title,'ico-info');
				} else {
					this.messageBoxService.showMsgBox(response.message || 'timekeeping.timecontrolling.errorOccured',title,'ico-error');
				}
			});
		}
	}

	public assertSelection(selItem: IReportEntity|null, title: string): boolean {
		if (selItem && selItem.Id >= 0) {
			return true;
		} else {
			this.messageBoxService.showMsgBox('cloud.common.noCurrentSelection',title, 'ico-info');
			return false;
		}
	}
}
