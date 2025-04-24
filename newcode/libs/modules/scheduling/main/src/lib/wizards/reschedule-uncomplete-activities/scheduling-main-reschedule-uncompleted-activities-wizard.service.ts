import { Injectable, inject } from '@angular/core';
import { IActivityEntity } from '@libs/scheduling/interfaces';
import { SchedulingMainDataService } from '../../services/scheduling-main-data.service';
import { SchedulingEntityExecutionHelper } from '../common/scheduling-entity-execution-helper.class';
import { RescheduleUncompleteActivitiesDialogConfig } from './reschedule-uncomplete-activities-dialog-config.class';
import { IEditorDialogResult, StandardDialogButtonId, UiCommonFormDialogService } from '@libs/ui/common';

export class UncompleteActivities{
	public StartDate: Date = new Date();
	public Kind: number = 1;
}

@Injectable({
	providedIn: 'root'
})
export class SchedulingMainRescheduleUncompletedActivitiesWizardService {
	private readonly modalDialogService = inject(UiCommonFormDialogService);

	public rescheduleIncompleteTask(dataService: SchedulingMainDataService){
		const selectedEntity = dataService.getSelectedEntity();
		const scheduleId = selectedEntity?.ScheduleFk;

		if (scheduleId) {
			const uncompleteActivities = new UncompleteActivities();
			const dialogConfigurator = new RescheduleUncompleteActivitiesDialogConfig();

			this.modalDialogService.showDialog(dialogConfigurator.createFormConfiguration(uncompleteActivities))?.then((result: IEditorDialogResult<UncompleteActivities>) => {
				if (result.closingButtonId === StandardDialogButtonId.Ok && result.value) {
					const action = {
						Action: 22,
						ScheduleId: scheduleId,
						RescheduleUncompleteTasks: {
							IsEntireSchedule: result.value?.Kind === 1,
							StartDate: result.value?.StartDate,
							Activities: result.value?.Kind === 2
								? [selectedEntity].filter((activity): activity is IActivityEntity => activity !== null)
								: undefined
						}
					};

					SchedulingEntityExecutionHelper.execute<UncompleteActivities>(action).then((response) => {
						if (response){
							dataService.calculateActivities(null, response);
						}
					}).then(() => {
						SchedulingEntityExecutionHelper.showSuccessDialog();
						dataService.refreshAll();
					});
				}
			});

		} else {
			SchedulingEntityExecutionHelper.openDialogFailed();
		}
	}
}
