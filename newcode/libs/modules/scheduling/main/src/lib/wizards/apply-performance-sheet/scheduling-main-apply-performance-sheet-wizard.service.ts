/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IEditorDialogResult,	StandardDialogButtonId, UiCommonFormDialogService } from '@libs/ui/common';
import { SchedulingMainDataService } from '../../services/scheduling-main-data.service';
import { ApplyPerformanceSheetDialogConfig } from './apply-performance-sheet-dialog-config.class';
import { SchedulingEntityExecutionHelper } from '../common/scheduling-entity-execution-helper.class';
import { IPerformanceSheetEntity } from '../../model/models';

@Injectable({providedIn: 'root'})
export class ApplyPerformanceSheetService{
	private readonly modalDialogService = inject(UiCommonFormDialogService);
	public applyPerformanceSheet(dataService: SchedulingMainDataService) {
		const scheduleId = dataService.getSelectedEntity()?.ScheduleFk;
		if (scheduleId) {
			const performanceSheet: IPerformanceSheetEntity = {
				NotStarted: true,
				Started: false,
				FinishedActivities: false
			};
			const dialogConfigurator = new ApplyPerformanceSheetDialogConfig();

			this.modalDialogService.showDialog(dialogConfigurator.createFormConfiguration(performanceSheet))?.then((result:IEditorDialogResult<IPerformanceSheetEntity>) => {
				if (result.closingButtonId === StandardDialogButtonId.Ok && result.value) {
					const action = {
						Action: 20,
						ScheduleId: scheduleId,
						PerformanceSheet: result.value
					};

					SchedulingEntityExecutionHelper.execute<IPerformanceSheetEntity>(action).then(() => {
						SchedulingEntityExecutionHelper.showSuccessDialog();
					});
				}
			});
		} else {
			SchedulingEntityExecutionHelper.openDialogFailed();
		}
	}
}