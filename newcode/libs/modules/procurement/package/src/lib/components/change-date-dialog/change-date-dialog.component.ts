/*
 * Copyright(c) RIB Software GmbH
 */

import {Component, inject, Inject, InjectionToken} from '@angular/core';
import {IPrcPackageEntity} from '@libs/procurement/interfaces';
import {PlatformDateService} from '@libs/platform/common';

export interface IChangeDateDialogData {
	activity: {
		PlannedStart?: Date,
		PlannedFinish?: Date,
		ActualStart?: Date,
		ActualFinish?: Date
	},
	headerEntity: IPrcPackageEntity
}

export const PACKAGE_CHANGE_DATE_DIALOG_DATA_TOKEN = new InjectionToken<IChangeDateDialogData>('package-change-date-dialog-data-token');

@Component({
	selector: 'procurement-package-change-date-dialog',
	templateUrl: './change-date-dialog.component.html',
	styleUrls: ['./change-date-dialog.component.scss'],
})
export class ProcurementPackageChangeDateDialogComponent {
	private readonly dateService = inject(PlatformDateService);
	public information: string[] = [];
	public tip = 'Do you want to update the dates to the values from the activity?';

	public constructor(@Inject(PACKAGE_CHANGE_DATE_DIALOG_DATA_TOKEN) public data: IChangeDateDialogData) {
		this.information = this.getInfo();
	}

	public getInfo() {
		const dateInfo = { // todo chi: the conversion right?
			packagePlanStartDate: this.data.headerEntity.PlannedStart ?
				this.dateService.formatLocal(this.data.headerEntity.PlannedStart, 'yyyy-MM-dd') : 'No Value',
			packagePlanEndDate: this.data.headerEntity.PlannedEnd ?
				this.dateService.formatLocal(this.data.headerEntity.PlannedEnd, 'yyyy-MM-dd') : 'No Value',
			packageActStartDate: this.data.headerEntity.ActualStart ?
				this.dateService.formatLocal(this.data.headerEntity.ActualStart, 'yyyy-MM-dd') : 'No Value',
			packageActEndDate: this.data.headerEntity.ActualEnd ?
				this.dateService.formatLocal(this.data.headerEntity.ActualEnd, 'yyyy-MM-dd') : 'No Value',

			ActivityPlanStartDate: this.data.activity.PlannedStart ?
				this.dateService.formatUTC(this.data.activity.PlannedStart, 'yyyy-MM-dd') : 'No Value',
			ActivityPlanEndDate: this.data.activity.PlannedFinish ?
				this.dateService.formatUTC(this.data.activity.PlannedFinish, 'yyyy-MM-dd') : 'No Value',
			ActivityActStartDate: this.data.activity.ActualStart ?
				this.dateService.formatUTC(this.data.activity.ActualStart, 'yyyy-MM-dd') : 'No Value',
			ActivityActEndDate: this.data.activity.ActualFinish ?
				this.dateService.formatUTC(this.data.activity.ActualFinish, 'yyyy-MM-dd') : 'No Value'
		};

		let info: string[] = [];
		if (dateInfo.packagePlanStartDate !== dateInfo.ActivityPlanStartDate) {
			info = info.concat([
				'Planned Start Date in Package  is ' + dateInfo.packagePlanStartDate,
				'Planned Start Date in Activity is ' + dateInfo.ActivityPlanStartDate
			]);
		}
		if (dateInfo.packagePlanEndDate !== dateInfo.ActivityPlanEndDate) {
			info = info.concat([
				'Planned End   Date in Package  is ' + dateInfo.packagePlanEndDate,
				'Planned End   Date in Activity is ' + dateInfo.ActivityPlanEndDate
			]);
		}
		if (dateInfo.packageActStartDate !== dateInfo.ActivityActStartDate) {
			info = info.concat([
				'Actual  Start Date in Package  is ' + dateInfo.packageActStartDate,
				'Actual  Start Date in Activity is ' + dateInfo.ActivityActStartDate
			]);
		}
		if (dateInfo.packageActEndDate !== dateInfo.ActivityActEndDate) {
			info = info.concat([
				'Actual  End   Date in Package  is ' + dateInfo.packageActEndDate,
				'Actual  End   Date in Activity is ' + dateInfo.ActivityActEndDate
			]);
		}

		return info;
	}
}
