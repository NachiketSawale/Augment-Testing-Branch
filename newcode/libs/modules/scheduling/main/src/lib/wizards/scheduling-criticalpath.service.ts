/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { PlatformConfigurationService } from '@libs/platform/common';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { SchedulingMainDataService } from '../services/scheduling-main-data.service';
import { IActivityEntity } from '@libs/scheduling/interfaces';

@Injectable({
	providedIn: 'root',
})
export class SchedulingCriticalPathService {
	protected configurationService = inject(PlatformConfigurationService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly dataService = inject(SchedulingMainDataService);

	public criticalPath() {
		/*
		TODO getSelectedSchedule, pinning context
		private readonly schedule = schedulingMainService.getSelectedSchedule();
		*/
		const selectedEntity = this.dataService.getSelectedEntity();
		//const schedule = selectedEntity.ScheduleFk;
		const title = 'scheduling.main.criticalPath';
		if (this.assertSelection(selectedEntity, title)) {
			// TODO: updateWithPostProcess and doUpdate
			/*	const action = {
					Action: 7,
					EffectedItemId: schedule,
				};

				this.updateWithPostProcess(action).then(function (result) {
					this.messageBoxService.showMsgBox('scheduling.main.criticalPath', result.ActionResult);
					return schedulingMainService.load();
				});*/
		}
	}

	public assertSelection(selItem: IActivityEntity | null, title: string): boolean {
		if (selItem?.Id !== null && selItem?.Id !== undefined && selItem.Id >= 0) {
			return true;
		} else {
			this.messageBoxService.showMsgBox('cloud.common.noCurrentSelection', title, 'ico-info');
			return false;
		}
	}
}
