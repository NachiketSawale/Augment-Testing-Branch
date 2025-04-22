import { inject, Injectable } from '@angular/core';
import { ICustomDialogOptions, StandardDialogButtonId, UiCommonDialogService } from '@libs/ui/common';
import { BusinesspartnerCertificateCreateReminderDialogComponent } from '../../components/create-reminder/create-reminder-dialog.component';

@Injectable({
	providedIn: 'root'
})
export class CreateRemindersService {
	private readonly dialogService = inject(UiCommonDialogService);

	private dialogOptions: ICustomDialogOptions<StandardDialogButtonId, BusinesspartnerCertificateCreateReminderDialogComponent> = {
		bodyComponent: BusinesspartnerCertificateCreateReminderDialogComponent,
		headerText: {key: 'businesspartner.certificate.reminder.item.createReminder'},
		backdrop: false,
		buttons: [
			{
				id: StandardDialogButtonId.Ok,
				fn: async (event, info) => {
					await info.dialog.body.onOk();
				},
				autoClose: false,
			},
			{
				id: StandardDialogButtonId.Cancel,
				caption: {key: 'ui.common.dialog.cancelBtn'},
			}
		],
	};

	public async createReminders() {
		await this.dialogService.show(this.dialogOptions);
	}
}