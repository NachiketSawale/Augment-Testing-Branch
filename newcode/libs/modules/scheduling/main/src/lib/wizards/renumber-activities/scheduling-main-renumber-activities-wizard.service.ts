/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { SchedulingMainDataService } from '../../services/scheduling-main-data.service';
import { SchedulingEntityExecutionHelper } from '../common/scheduling-entity-execution-helper.class';
import { IRenumberDataEntity } from '@libs/scheduling/interfaces';

@Injectable({
	providedIn: 'root'
})

export class SchedulingMainRenumberActivitiesWizardService {

	public renumberActivities(dataService: SchedulingMainDataService) {
		const activityId = dataService.getSelectedEntity()?.Id;
		if (activityId) {

			SchedulingEntityExecutionHelper.getActivityProperties()?.then((props) => {
				if (props) {
					SchedulingEntityExecutionHelper.executeWithTestRun<IRenumberDataEntity>(activityId, props);
				}
			});
		} else {
			SchedulingEntityExecutionHelper.openDialogFailed();
		}
	}
}