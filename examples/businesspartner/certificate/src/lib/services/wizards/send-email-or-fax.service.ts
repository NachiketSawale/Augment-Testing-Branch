import { inject, Injectable } from '@angular/core';
import { map } from 'lodash';
import { BusinesspartnerCertificateReminderDataService } from '../certificate-reminder-data.service';
import { PlatformConfigurationService, PlatformHttpService, PlatformTranslateService, ServiceLocator } from '@libs/platform/common';
import { FieldType, IFormConfig, StandardDialogButtonId, UiCommonFormDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { EntityRuntimeData } from '@libs/platform/data-access';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { BusinesspartnerCertificateEmailRecipientComponent } from '../../components/email-recipient/email-recipient.component';
import { CommunicationType, ICommunicationDataModel, ICommunicationRequestEntity, ICommunicationResponse, IParameter, IReport, IReportRequest, ISendEmailOrFaxDialogModel, ISendingData } from '@libs/businesspartner/interfaces';
import { PlatformAuthService } from '@libs/platform/authentication';


@Injectable({
	providedIn: 'root'
})
export class SendEmailOrFaxService {
	private readonly bpCertificateReminderDataService = inject(BusinesspartnerCertificateReminderDataService);
	private readonly formDialogService = inject(UiCommonFormDialogService);
	private readonly translate = inject(PlatformTranslateService);
	private readonly http = inject(PlatformHttpService);
	private readonly configService = inject(PlatformConfigurationService);
	private readonly dialogService = inject(UiCommonMessageBoxService);
	private readonly authService = inject(PlatformAuthService);

	private model: ISendEmailOrFaxDialogModel = {
		CommunicationType: CommunicationType.Email,
		BatchId: '',
		CompanyId: undefined,
		RecipientList: [],
		Username: '',
		Password: '',
		SendIsDisabled: false,
		IsLoading: false,
	};

	public get Model(): ISendEmailOrFaxDialogModel {
		return this.model;
	}

	private sendEmailRuntimeInfo: EntityRuntimeData<ISendEmailOrFaxDialogModel> = {
		readOnlyFields: [],
		validationResults: [],
		entityIsReadOnly: false
	};

	private sendEmailFormConfig: IFormConfig<ISendEmailOrFaxDialogModel> = {
		formId: 'businesspartner.certificate.wizard.email.fax',
		showGrouping: true,
		groups: [
			{
				groupId: 1,
				header: {text: 'Email Settings', key: 'businesspartner.certificate.wizard.dialogTitle.emailSettings'},
				sortOrder: 1,
				open: true,
			},
			{
				groupId: 2,
				header: {text: 'Recipients', key: 'businesspartner.certificate.wizard.dialogTitle.emailRecipients'},
				sortOrder: 2,
				open: true,
			},
			{
				groupId: 3,
				header: {text: 'Sender', key: 'basics.common.sender'},
				sortOrder: 3,
				open: true,
			},
		],
		rows: [
			{
				groupId: 1,
				id: 'BatchId',
				model: 'BatchId',
				label: {
					text: 'Batch No.',
					key: 'businesspartner.certificate.report.label.batchId'
				},
				type: FieldType.Description,
				required: true,
			},
			{
				groupId: 1,
				id: 'CompanyId',
				model: 'CompanyId',
				label: {
					text: 'Company',
					key: 'cloud.common.entityCompany'
				},
				...BasicsSharedLookupOverloadProvider.provideCertificateCompanyLookupOverload(false, true),
			},
			{
				groupId: 2,
				id: 'Recipients',
				type: FieldType.CustomComponent,
				componentType: BusinesspartnerCertificateEmailRecipientComponent,
			},
			{
				groupId: 3,
				id: 'Username',
				model: 'Username',
				label: {
					text: 'Username',
					key: 'platform.loginUsername'
				},
				type: FieldType.Email,
				required: true,
			},
			{
				groupId: 3,
				id: 'Password',
				model: 'Password',
				label: {
					text: 'Password',
					key: 'platform.loginPassword'
				},
				type: FieldType.Password,
				required: true,
			}
		]
	};

	private translation = {
		name: 'email',
		headerText: 'basics.common.email.headerText',
		recipientText: 'basics.common.email.recipientText',
		successText: 'basics.common.email.success',
		failText: 'basics.common.email.fail'
	};
	private translationMap = [
		this.translation,
		{
			name: 'fax',
			headerText: 'basics.common.fax.headerText',
			recipientText: 'basics.common.fax.recipientText',
			successText: 'basics.common.fax.success',
			failText: 'basics.common.fax.fail'
		}
	];

	public async sendEmail(communicationType: CommunicationType) {
		const select = this.bpCertificateReminderDataService.getSelectedEntity();
		if (!select) {
			console.error('please select a reminder record first');
			return;
		}
		this.model.SendIsDisabled = false;
		this.model.CommunicationType = communicationType;
		this.model.BatchId = select.BatchId;
		this.model.CompanyId = this.configService.clientId;
		this.model.Username = '';
		this.model.Password = '';
		this.getCommunicationList().then((response) => {
			this.model.RecipientList = response.Receivers;
			if (response.Sender) {
				this.model.Username = response.Sender;
			} else {
				this.authService.getUserData().subscribe((userData) => {
					this.model.Username = userData.email;
				});
			}
		});

		await this.translate.load(['businesspartner.certificate']);
		const translation = this.translationMap.find(t => t.name === communicationType);
		if (translation) {
			this.translation = translation;
		}
		await this.formDialogService.showDialog<ISendEmailOrFaxDialogModel>({
			id: 'businesspartner-certificate-wizard-send-email-or-fax',
			headerText: this.translate.instant(this.translation.headerText).text,
			height: '760px',
			width: '1024px',
			minWidth: '250px',
			formConfiguration: this.sendEmailFormConfig,
			entity: this.model,
			runtime: this.sendEmailRuntimeInfo,
			buttons: [
				{
					id: 'sendBtn',
					caption: {key: 'basics.common.button.send'},
					isDisabled: (info) => {
						if (!info.dialog.value?.Username || !info.dialog.value?.Password) {
							return true;
						}
						if (!info.dialog.value?.RecipientList.some(r => r.IsCheckToSend)) {
							return true;
						}
						return info.dialog.value?.SendIsDisabled;
					},
					fn: async (event, info) => {
						if (!info.dialog.value) {
							return;
						}
						const sendService = ServiceLocator.injector.get(SendEmailOrFaxService);
						const dataInfo = await sendService.getEmailOrFaxInfo();

						if (dataInfo?.Receivers && dataInfo.Receivers.length === 0) {
							await this.dialogService.showMsgBox(this.translate.instant(this.translation.recipientText).text, this.translate.instant('cloud.common.informationDialogHeader').text, 'ico-info');
							return;
						}
						info.dialog.value.SendIsDisabled = true;
						info.dialog.value.IsLoading = true; //todo loading, will loading be added to form config?
						await this.http.post<boolean>('businesspartner/certificate/wizard/' + info.dialog.value?.CommunicationType, dataInfo).then(
							() => {
								this.dialogService.showMsgBox(this.translate.instant(this.translation.successText).text, this.translate.instant('cloud.common.informationDialogHeader').text, 'ico-info');
								info.dialog.close(StandardDialogButtonId.Ok);
							},
							error => {
								let msg = this.translate.instant(this.translation.failText).text;
								if (error && error.ErrorMessage) {
									msg = msg + ' ' + error.data.ErrorMessage;
								}
								this.dialogService.showMsgBox(msg, this.translate.instant('cloud.common.informationDialogHeader').text, 'ico-info');
								if (info.dialog.value) {
									info.dialog.value.SendIsDisabled = false;
								}
							}).finally(
							() => {
								if (info.dialog.value) {
									info.dialog.value.IsLoading = false;
								}
							}
						);
					}
				},
				{
					id: 'closeBtn',
					caption: {key: 'basics.common.button.close'},
					autoClose: true,
				},
			],
		});
	}

	//region getEmailOrFaxInfo

	private async getEmailOrFaxInfo() {
		const info: ICommunicationDataModel = {
			Subject: this.translate.instant('businesspartner.certificate.wizard.emailSubject.reminderLetter').text,
			Receivers: [],
			AttachmentRequests: [], // collect all the requests of attachment
			BodyRequests: [],       // collect all the requests of email body
			IsReportBody: this.model.CommunicationType === CommunicationType.Email,
			CommunicationType: this.model.CommunicationType,
			EmailAccount: {UserName: this.model.Username, Password: this.model.Password},
		};
		const checkedRecipients = this.model.RecipientList.filter(r => r.IsCheckToSend);
		for (const receiver of checkedRecipients) {
			let sendingData: ISendingData;
			if (this.model.CommunicationType === CommunicationType.Email) {
				sendingData = {To: receiver.Email, BodyIds: [], AttachmentIds: []};
			} else {
				sendingData = {To: receiver.Telefax, BodyIds: [], AttachmentIds: []};
			}
			const reportRequest = this.createReportRequest(this.model.CompanyId, this.model.BatchId, receiver.BusinessPartnerId);
			const id = 'Bp' + receiver.BusinessPartnerId + this.generateGuid();
			// id is very important for distinguishing the attachments.
			sendingData.AttachmentIds.push(id);
			if (!info.AttachmentRequests.some(r => r.id === id)) {
				info.AttachmentRequests.push({id: id, Request: reportRequest});
			}
			// id is very important for distinguishing the email bodies.
			sendingData.BodyIds.push(id);
			if (!info.BodyRequests.some(r => r.id === id)) {
				info.BodyRequests.push({id: id, Request: reportRequest});
			}
			info.Receivers.push(sendingData);
		}
		return info;
	}

	private async getCommunicationList() {
		const request: ICommunicationRequestEntity = {
			BatchId: this.model.BatchId,
			CompanyId: this.model.CompanyId,
			CommunicationType: this.model.CommunicationType,
		};
		return await this.http.post<ICommunicationResponse>('businesspartner/certificate/certificatereminder2certificateview/communicationlist', request);
	}

	private createReportRequest(companyId: number | undefined, batchId: string, businessPartnerId: number | undefined) {
		const report: IReport = {
			Name: 'Reminder Letter',
			TemplateName: 'RemindLetter.frx',
			Path: 'system\\Certificate'
		};
		const parameters: IParameter[] = [
			{
				Name: 'CompanyID',
				ParamValue: companyId
			}, {
				Name: 'BatchId',
				ParamValue: JSON.stringify(batchId)
			}, {
				Name: 'BusinessPartnerID',
				ParamValue: businessPartnerId
			}, {
				Name: 'UserID',
				ParamValue: this.configService.loggedInUserId
			}
		];
		const result: IReportRequest = {
			ReportData: report,
			GearData: {Name: 'pdf'},
			Parameters: map(parameters, item => {
				return {Key: item.Name, Value: item};
			})
		};
		return result;
	}

	private generateGuid() {
		const buffer = new Uint8Array(16); // Create a buffer for 16 bytes (128 bits)
		window.crypto.getRandomValues(buffer); // Fill the buffer with cryptographically secure random values
		// Convert each byte to a hex string
		let guid = '';
		for (const byte of buffer) {
			guid += byte.toString(16).padStart(2, '0'); // Ensure each byte is represented by two hex characters
		}
		return guid;
	}

	//endregion
}