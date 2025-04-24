import { IInitializationContext } from '@libs/platform/common';
import { CreateBaselineService } from './create-baseline/scheduling-main-create-baseline-wizard.service';
import { DeleteBaselineService } from './delete-baseline/scheduling-main-delete-baseline-wizard.service';
import { AssignControllingUnitsService } from './assign-controlling-units/scheduling-main-assign-cu-wizard.service';
import { ApplyPerformanceSheetService } from './apply-performance-sheet/scheduling-main-apply-performance-sheet-wizard.service';
import { SchedulingMainRescheduleUncompletedActivitiesWizardService } from './reschedule-uncomplete-activities/scheduling-main-reschedule-uncompleted-activities-wizard.service';
import { SplitActivityByLocationsService } from './split-activity-by-locations/scheduling-main-split-activity-by-locations-wizard.service';
import { SchedulingAddProgressToScheduleActivitiesWizardService } from './scheduling-add-progress-to-schedule-activities.service';
import { SchedulingMainRenumberActivitiesWizardService } from './renumber-activities/scheduling-main-renumber-activities-wizard.service';
import { SchedulingMainDataService } from '../services/scheduling-main-data.service';
import { SchedulingEntityExecutionHelper } from './common/scheduling-entity-execution-helper.class';
import { SchedulingCriticalPathService } from './scheduling-criticalpath.service';
import { SchedulingExportToMSProjectService } from './export-to-import-from-ms-project/export-to-ms-project-wizard.service';
import { ChangeActivityStateOfAllActivitiesWizardService } from './change-status-of-all-activities/change-status-of-all-activities-wizard.service';
import { SchedulingChangeActivityStatusService } from './scheduling-change-activity-status.service';
import { SchedulingMainSynchronizeSchedulesWizardService } from './scheduling-main-synchronize-schedules-wizard.service';
import { SchedulingImportMSProjectService } from './export-to-import-from-ms-project/import-from-ms-project-wizard.service';

export class SchedulingMainWizard {
	public createBaseline(context: IInitializationContext) {
		const service = context.injector.get(CreateBaselineService);
		const dataService = context.injector.get(SchedulingMainDataService);
		service.createBaseline(dataService);
	}

	public async deleteBaseline(context: IInitializationContext) {
		const service = context.injector.get(DeleteBaselineService);
		const dataService = context.injector.get(SchedulingMainDataService);
		service.deleteBaseline(dataService);
	}

	public assignControllingUnits(context: IInitializationContext): void {
		const service = context.injector.get(AssignControllingUnitsService);
		const dataService = context.injector.get(SchedulingMainDataService);
		service.assignControllingUnits(dataService);
	}

	public applyPerformanceSheet(context: IInitializationContext): void {
		const service = context.injector.get(ApplyPerformanceSheetService);
		const dataService = context.injector.get(SchedulingMainDataService);
		service.applyPerformanceSheet(dataService);
	}

	public async splitActivityByLocations(context: IInitializationContext) {
		const service = context.injector.get(SplitActivityByLocationsService);
		const dataService = context.injector.get(SchedulingMainDataService);
		service.splitActivityByLocations(dataService);
	}
	public addProgressToScheduledActivities(context: IInitializationContext) {
		const service = context.injector.get(SchedulingAddProgressToScheduleActivitiesWizardService);
		service.addProgressToScheduledActivities();
	}

	public renumberActivities(context: IInitializationContext) {
		const service = context.injector.get(SchedulingMainRenumberActivitiesWizardService);
		const dataService = context.injector.get(SchedulingMainDataService);
		service.renumberActivities(dataService);
	}

	public rescheduleUncompletedActivities(context: IInitializationContext) {
		const service = context.injector.get(SchedulingMainRescheduleUncompletedActivitiesWizardService);
		const dataService = context.injector.get(SchedulingMainDataService);
		service.rescheduleIncompleteTask(dataService);
	}

	public rescheduleActivities(context: IInitializationContext) {
		const dataService = context.injector.get(SchedulingMainDataService);
		const scheduleId = dataService.getSelectedEntity()?.ScheduleFk;
		if (scheduleId) {
			const action = {
				Action: 11,
				EffectedItemId: scheduleId
			};

			SchedulingEntityExecutionHelper.execute(action)
				.then((response) => {
					if (typeof response === 'object' && response !== null) {
						dataService.calculateActivities(null, response);
					}
				})
				.then(() => {
					SchedulingEntityExecutionHelper.showSuccessDialog();
					dataService.refreshAll();
				});
		} else {
			SchedulingEntityExecutionHelper.openDialogFailed();
		}
	}

	public criticalPath(context: IInitializationContext) {
		const service = context.injector.get(SchedulingCriticalPathService);
		service.criticalPath();
	}

	public exportToMSProject(context: IInitializationContext){
		const service = context.injector.get(SchedulingExportToMSProjectService);
		const dataService = context.injector.get(SchedulingMainDataService);
		service.exportToMSProject(dataService);
	}

	public importMSProject(context: IInitializationContext){
		const service = context.injector.get(SchedulingImportMSProjectService);
		const dataService = context.injector.get(SchedulingMainDataService);
		service.importMSProject(dataService);
	}

	public changeActivityStateOfAllActivities(context: IInitializationContext) {
		const service = context.injector.get(ChangeActivityStateOfAllActivitiesWizardService);
		const dataService = context.injector.get(SchedulingMainDataService);
		service.changeActivityStateOfAllActivitiesWizardService(dataService);
	}

	public changeActivityStatus(context: IInitializationContext) {
		const service = context.injector.get(SchedulingChangeActivityStatusService);
		service.onStartChangeStatusWizard();
	}

	public synchronizeSchedules(context: IInitializationContext) {
		const service = context.injector.get(SchedulingMainSynchronizeSchedulesWizardService);
		service.synchronizeSchedules();
	}
}
