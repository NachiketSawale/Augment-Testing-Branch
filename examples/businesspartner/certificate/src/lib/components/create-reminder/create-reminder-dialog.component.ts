import { Component, inject } from '@angular/core';
import { FieldType, IFormConfig, } from '@libs/ui/common';
import { PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { ICreateReminderDialogModel, ICreateReminderEntity, ResponseStatus } from '@libs/businesspartner/interfaces';
import { BusinesspartnerCertificateReminderDataService } from '../../services/certificate-reminder-data.service';


@Component({
	selector: 'businesspartner-certificate-create-reminder-dialog',
	templateUrl: './create-reminder-dialog.component.html',
	styleUrls: ['./create-reminder-dialog.component.scss']
})
export class BusinesspartnerCertificateCreateReminderDialogComponent {
	private readonly http = inject(PlatformHttpService);
	private readonly translate = inject(PlatformTranslateService);
	private readonly reminderDataService = inject(BusinesspartnerCertificateReminderDataService);

	protected readonly responseStatus = ResponseStatus;
	private readonly nowDate = new Date();

	public readonly model: ICreateReminderDialogModel = {
		CreateReminderEntity: {
			BatchId: this.getBatchId(),
			BatchDate: this.nowDate,
			Email: false,
			Telefax: false,
		},
		ResultStatus: this.responseStatus.Unknown,
		ResultMessage: '',
		Loading: false
	};

	public configuration: IFormConfig<ICreateReminderEntity> = {
		formId: 'create-reminders-form',
		showGrouping: false,
		rows: [
			{
				id: 'BatchId',
				label: {
					key: 'businesspartner.certificate.reminder.label.batch',
					text: 'Batch'
				},
				type: FieldType.Description,
				model: 'BatchId',
			},
			{
				id: 'BatchDate',
				label: {
					key: 'businesspartner.certificate.reminder.label.batchDate',
					text: 'Batch Date'
				},
				type: FieldType.Date, //DateUtc?? // Any: this is not necessary for a date in my opinion.
				model: 'BatchDate',
			},
			{
				id: 'Email',
				label: {
					key: 'businesspartner.certificate.reminder.label.useEmail',
					text: 'Use E-Mail'
				},
				type: FieldType.Boolean,
				model: 'Email',
			},
			{
				id: 'Telefax',
				label: {
					key: 'businesspartner.certificate.reminder.label.useTelefax',
					text: 'Use Telefax'
				},
				type: FieldType.Boolean,
				model: 'Telefax',
			},
		]
	};

	private getBatchId(): string {
		const yearStr = this.nowDate.getFullYear();
		const monthStr = (this.nowDate.getMonth() + 1) >= 10 ? this.nowDate.getMonth() + 1 : '0' + (this.nowDate.getMonth() + 1);
		const dayStr = this.nowDate.getDate() >= 10 ? this.nowDate.getDate() : ('0' + this.nowDate.getDate());
		return '' + yearStr + monthStr + dayStr;
	}

	public async onOk(): Promise<void> {
		// init message
		this.model.ResultStatus = ResponseStatus.Unknown;
		this.model.ResultMessage = '';
		this.model.Loading = true;

		// // change to utc time to save // Any: this is not necessary for a date in my opinion.
		// this.completeCreateReminderEntity.CreateReminderEntity.BatchDate = new Date(this.nowDate.getTime() + this.nowDate.getTimezoneOffset() * 60000);

		const url = 'businesspartner/certificate/certificatereminder/wizardcreate';
		const result = await this.http.post<boolean>(url, this.model.CreateReminderEntity);
		this.model.Loading = false;
		if (result) {
			this.model.ResultStatus = ResponseStatus.Success;
			this.model.ResultMessage = this.translate.instant('businesspartner.main.wizardCreateSuccessfully').text;
			this.reminderDataService.reload().then(); // reload reminders.
		} else {
			this.model.ResultStatus = ResponseStatus.Error;
			this.model.ResultMessage = this.translate.instant('businesspartner.main.wizardCreateFail').text;
		}
	}
}