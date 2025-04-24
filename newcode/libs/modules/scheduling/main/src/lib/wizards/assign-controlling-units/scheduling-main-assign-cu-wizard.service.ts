/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IEditorDialogResult,	StandardDialogButtonId, UiCommonFormDialogService } from '@libs/ui/common';
import { SchedulingMainDataService } from '../../services/scheduling-main-data.service';
import { AssignControllingUnitsDialogConfig } from './assign-controlling-units-dialog-config.class';
import { SchedulingEntityExecutionHelper } from '../common/scheduling-entity-execution-helper.class';
import { IAssignCUDataEntity } from '@libs/scheduling/interfaces';

@Injectable({
	providedIn: 'root'
})
export class AssignControllingUnitsService{
	private readonly modalDialogService = inject(UiCommonFormDialogService);

	public assignControllingUnits(dataService: SchedulingMainDataService){
		const scheduleId = dataService.getSelectedEntity()?.ScheduleFk;
		if (scheduleId) {
			const controllingUnits: IAssignCUDataEntity = {
				IsByTemplate: true,
				IsFromActivityToLineItem: false,
				IsOverwriteCuInActivity: false,
				IsOverwriteCuInLineItem: false
			};
			const dialogConfigurator = new AssignControllingUnitsDialogConfig();

			this.modalDialogService.showDialog(dialogConfigurator.createFormConfiguration(controllingUnits))?.then((result: IEditorDialogResult<IAssignCUDataEntity>) => {
				if (result.closingButtonId === StandardDialogButtonId.Ok && result.value) {
					const action = {
						Action: 10,
						ScheduleId: scheduleId,
						AssignCUData: result.value
					};

					SchedulingEntityExecutionHelper.execute<IAssignCUDataEntity>(action).then(() => {
						SchedulingEntityExecutionHelper.showSuccessDialog();
					});
				}
			});
		} else {
			SchedulingEntityExecutionHelper.openDialogFailed();
		}
	}
}