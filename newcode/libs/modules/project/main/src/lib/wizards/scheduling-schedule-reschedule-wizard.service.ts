/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { PlatformConfigurationService } from '@libs/platform/common';
import { HttpClient } from '@angular/common/http';
import { SchedulingScheduleDataService } from '@libs/scheduling/schedule';
import { IScheduleEntity } from '@libs/scheduling/interfaces';

@Injectable({
	providedIn: 'root'
})

export class SchedulingScheduleRescheduleWizardService {
	protected http = inject(HttpClient);
	protected configurationService = inject(PlatformConfigurationService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly dataService = inject(SchedulingScheduleDataService);

	public reScheduleAllSchedules() {
		const selPrj: IScheduleEntity = this.dataService.getSelection()[0];
		const title = 'project.main.rescheduleSelectedSchedules';
		// TODO
		// if (platformSidebarWizardCommonTasksService.assertSelection(selPrj, title)) {
		// 	let schedIds = _.map(schedulingScheduleEditService.getSelectedEntities(), 'Id');
		// 	schedulingScheduleRescheduleService.reScheduleAllSchedules(schedIds).then(function (retVal) {
		// 		giveOutRescheduleResult(retVal.data, 'project.main.rescheduleSchedules');
		// 	});
		// }

		if (this.assertSelection(selPrj, title)) {
			const schedIds = this.dataService.getSelection().map(entity => entity.Id);
			this.executeReScheduleAllSchedules(schedIds).subscribe(
				(retVal) => { // Use the interface here
					this.messageBoxService.showMsgBox('Schedules have been successfully rescheduled',title,'ico-info');
				},
				error => {
					this.messageBoxService.showErrorDialog(error.error);
				}
			);
		}
	}

	public assertSelection(selItem: IScheduleEntity, title: string): boolean {
		if (selItem && selItem.Id >= 0) {
			return true;
		} else {
			this.messageBoxService.showMsgBox(title, 'cloud.common.noCurrentSelection', 'ico-info');
			return false;
		}
	}

	public executeReScheduleAllSchedules(scheduleIds: number[]) {
		const action = {
			Action: 2,
			IdsToHandle: scheduleIds
		};
		return this.http.post(`${this.configurationService.webApiBaseUrl}scheduling/schedule/execute`, action);
	}

}