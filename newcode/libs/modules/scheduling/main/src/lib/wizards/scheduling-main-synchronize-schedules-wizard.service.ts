import { Injectable, inject } from '@angular/core';
import { SchedulingMainDataService } from '../services/scheduling-main-data.service';
import { UiCommonMessageBoxService, StandardDialogButtonId, IMessageBoxOptions } from '@libs/ui/common';
import { IReportEntity } from '@libs/timekeeping/interfaces';
import { PlatformHttpService } from '@libs/platform/common';

@Injectable({
	providedIn: 'root'
})
export class SchedulingMainSynchronizeSchedulesWizardService {
	private readonly http = inject(PlatformHttpService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly schedulingMainService = inject(SchedulingMainDataService);

	public async synchronizeSchedules() {
		const schedule = this.schedulingMainService.getSelectedEntity();

		const entity = Array.isArray(schedule) && schedule.length > 0 ? schedule[0] : null;

		const title = 'scheduling.main.synchronizeSchedules';

		if (!this.assertSelection(entity, title)) {
			return;
		}

		const action = {
			Action: 24,
			ScheduleId: entity?.ScheduleFk ?? 0,
		};

		this.http.post('/scheduling/main/activity/execute', action)
			.then(() => {
				//this.schedulingMainService.reload(); TODO: Reload function
				this.showSuccessDialog();
			})
			.catch(() => {
				this.messageBoxService.showErrorDialog('scheduling.main.synchronizeSchedulesError');
			});
	}

	private assertSelection(selItem: IReportEntity | null, title: string): boolean {
		if (selItem && selItem.Id >= 0) {
			return true;
		} else {
			this.messageBoxService.showMsgBox('cloud.common.noCurrentSelection', title, 'ico-info');
			return false;
		}
	}

	private showSuccessDialog(): void {
		const notifyDialogConfig: IMessageBoxOptions = {
			headerText: 'cloud.common.infoBoxHeader',
			bodyText: 'cloud.common.doneSuccessfully',
			buttons: [{ id: StandardDialogButtonId.Ok }],
			iconClass: 'ico-info'
		};
		this.messageBoxService.showMsgBox(notifyDialogConfig);
	}
}
