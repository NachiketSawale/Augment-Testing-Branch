/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { ContextService, IReportParametersData, IReportPrepareData, PlatformConfigurationService, PlatformReportService, PlatformTranslateService, IReportData } from '@libs/platform/common';
import { FieldType, IFormConfig, StandardDialogButtonId, UiCommonFormDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { EntityRuntimeData } from '@libs/platform/data-access';
import { IRfqHeaderEntity } from '@libs/procurement/interfaces';

import { ProcurementRfqHeaderMainDataService } from '../services/procurement-rfq-header-main-data.service';
import { ProcurementRfqBusinessPartnerDataService } from '../services/rfq-business-partner-data.service';
import { IReportFormat } from '../services/lookups/procurement-rfq-email-fax-report-format-lookup.service';
import { ProcurementRfqRequisitionDataService } from '../services/rfq-requisition-data.service';
import { IReportBoqFormat } from '../services/lookups/procurement-rfq-email-fax-report-boq-format-lookup.service';

import { ProcurementRfqEmailFaxSettingComponent } from '../components/procurement-rfq-email-fax-setting/procurement-rfq-email-fax-setting.component';
import { ProcurementRfqEmailFaxRecipientComponent } from '../components/procurement-rfq-email-fax-recipient/procurement-rfq-email-fax-recipient.component';
import { ProcurementRfqEmailFaxSenderComponent } from '../components/procurement-rfq-email-fax-sender/procurement-rfq-email-fax-sender.component';

import { ICheckItemAndBoq, IDefaultRfqBpStatus, IEmailInfo, IEmailRequest, IReceiver, IReportRequest, ISendFaxEmailEntity } from '../model/entities/prc-rfq-email-fax-info.interface';
import { IPrcRfqEmailFaxRecipient } from '../model/entities/prc-rfq-email-fax-recipient.interface';

type ICommunicationType = 'email' | 'fax';
/**
 * Represent Procurement Rfq Send Email Or Fax Service.
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementRfqSendEmailOrFaxService {
	/**
	 * used to inject Procurementr rfq main data Service
	 */
	private readonly procurementRfqMainService = inject(ProcurementRfqHeaderMainDataService);
	/**
	 * used to inject Procurement Rfq Business Partner Data Service
	 */
	private readonly procurementRfqBusinessPartnerService = inject(ProcurementRfqBusinessPartnerDataService);
	/**
	 * Used to inject Context Service
	 */
	private readonly contextSrv = inject(ContextService);
	/**
	 * Used to inject form dialog service
	 */
	private readonly formDialogService = inject(UiCommonFormDialogService);
	/**
	 * Used to inject Platform translation service
	 */
	private readonly translateService = inject(PlatformTranslateService);
	/**
	 * Used ti inject Http client service
	 */
	private readonly http = inject(HttpClient);
	/**
	 * Used to inject Platform Configuration Service
	 */
	private readonly configService = inject(PlatformConfigurationService);
	/**
	 * Used to inject Message Box Service
	 */
	private readonly dialogService = inject(UiCommonMessageBoxService);
	/**
	 * Used to inject Platform Report Service
	 */
	private readonly platformReportService = inject(PlatformReportService);
	/**
	 * Used to inject Procurement RfqRequisition Data Service
	 */
	private readonly procurementRfqRequisitionDataService = inject(ProcurementRfqRequisitionDataService);

	public communicationType!:ICommunicationType;

	public existedBoq: boolean = true;
	public existedItem: boolean = true;
	public rfqReportTemplateItem!: IReportData;
	public boqReportTemplateItem!: IReportData;
	public itemReportTemplateItem!: IReportData;
	public gaebFormatExt!: string;
	public formatType!: IReportFormat;
	public boqFormatType!: IReportBoqFormat;

	public previewIsDisabled: boolean = true;
	public sendIsDisabled: boolean = true;

	/**
	 * Initialize Send Email or Fax Entity
	 */
	private readonly sendEmailFaxEntity: ISendFaxEmailEntity = {
		emailFaxSetting: '',
		recipient: '',
		sender: '',
	};
	/**
	 * Initialize Send Email or Fax Runtime Info
	 */
	private readonly sendEmailFaxRuntimeInfo: EntityRuntimeData<ISendFaxEmailEntity> = {
		readOnlyFields: [],
		validationResults: [],
		entityIsReadOnly: false,
	};
	/**
	 * Initialize Send Email or Fax Form Config
	 */
	private readonly sendEmailFaxFormConfig: IFormConfig<ISendFaxEmailEntity> = {
		formId: 'sendEmail',
		showGrouping: true,
		groups: [
			{
				groupId: 1,
				header: { text: 'Config Report Template and GAEB Format', key: 'procurement.rfq.wizard.emailFaxSetting' },
				visible: true,
				open: true,
				sortOrder: 1,
			},
			{
				groupId: 2,
				header: { text: 'Recipients', key: 'basics.common.recipient' },
				visible: true,
				open: true,
				sortOrder: 2,
			},
			{
				groupId: 3,
				header: { text: 'Sender', key: 'basics.common.sender' },
				visible: true,
				open: true,
				sortOrder: 3,
			},
		],
		rows: []
	};

	/**
	 * Dynamically update the form configuration based on communication type
	 */
	private updateSendEmailFaxFormConfig() {
		this.sendEmailFaxFormConfig.rows = [
			{
				groupId: 1,
				id: 'emailFaxSetting',
				type: FieldType.CustomComponent,
				componentType: ProcurementRfqEmailFaxSettingComponent,
			},
			{
				groupId: 2,
				id: 'Recipient',
				type: FieldType.CustomComponent,
				componentType: ProcurementRfqEmailFaxRecipientComponent,
			},
			...(this.communicationType === 'fax'
				? [
					{
						groupId: 3,
						id: 'Sender',
						type: FieldType.CustomComponent as const,
						componentType: ProcurementRfqEmailFaxSenderComponent,
					},
				]
				: []),
		];
	}
	

	/**
	 * Initialize Communication Type
	 */
	public readonly basicsCommonCommunicateTypes = {
		email: {
			name: 'email',
			headerText: 'basics.common.email.headerText',
			recipientText: 'basics.common.email.recipientText',
			successText: 'basics.common.email.success',
			failText: 'basics.common.email.fail',
		},
		fax: {
			name: 'fax',
			headerText: 'basics.common.fax.headerText',
			recipientText: 'basics.common.fax.recipientText',
			successText: 'basics.common.fax.success',
			failText: 'basics.common.fax.fail',
		},
	};

	/**
	 * Used to show email or Fax dialog
	 */
	public showEmailFaxDialog(type: keyof typeof this.basicsCommonCommunicateTypes) {
		this.communicationType = type;
		this.updateSendEmailFaxFormConfig();
		const bidders = this.procurementRfqBusinessPartnerService.getSelectedEntity();
		
		if (!bidders) {
			// Return early if no bidders
			this.dialogService.showMsgBox('procurement.rfq.wizard.noBidder', 'cloud.common.informationDialogHeader', 'ico-info');
			return;
		}
		
		const communicationChannelId = this.communicationType === 'email' ? 2 : 3;
		const noBidderMessage = this.communicationType === 'email' ? 'procurement.rfq.wizard.noEmailBidder' : 'procurement.rfq.wizard.noFaxBidder';
		
		// Filtering bidders for specified communication channel like email or Fax
		const filteredBidders = bidders.PrcCommunicationChannelFk === communicationChannelId;
		if (!filteredBidders) {
			// Return early if no bidders for the specified channel
			this.dialogService.showMsgBox(noBidderMessage, 'cloud.common.informationDialogHeader', 'ico-info');
			return;
		}

		return firstValueFrom(this.http.post<IDefaultRfqBpStatus>(this.configService.webApiBaseUrl + 'procurement/rfq/wizard/defaultrfqbpstatus', {}))
			.then(async (response) => {
				const defaultStatus = response.Id;
				const activeBidders = bidders.RfqBusinesspartnerStatusFk === defaultStatus;

				if (!activeBidders) {
					// Return early if no active bidders
					await this.dialogService.showMsgBox('procurement.rfq.wizard.noDefaultBidder', 'cloud.common.informationDialogHeader', 'ico-info');
					return;
				}

				const mainItem = this.procurementRfqMainService.getSelectedEntity();
				if (!mainItem) {
					// Return if no main item is selected
					return;
				}
				return this.http.post<ICheckItemAndBoq>(this.configService.webApiBaseUrl + 'procurement/rfq/wizard/checkitemandboq', { Id: mainItem.Id, Code: mainItem.Code }).subscribe((result) => {
					this.existedItem = result.item;
					this.existedBoq = result.boq;
					this.showDialog();
				});
			})
			.catch((error) => {
				console.error('Error fetching data:', error);
			});
	}

	/**
	 * show form email or fax dialog
	 */
	private async showDialog() {
		const result = await this.formDialogService.showDialog<ISendFaxEmailEntity>({
			id: '',
			headerText: this.communicationType === 'email' ? 'Send E-mail' : 'Send Fax',
			formConfiguration: this.sendEmailFaxFormConfig,
			entity: this.sendEmailFaxEntity,
			runtime: this.sendEmailFaxRuntimeInfo,
			customButtons: [
				{
					id: 'preview',
					caption: { key: 'basics.common.button.preview' },
					isDisabled: () => {
						return this.previewIsDisabled;
					},
					fn: () => this.previewReport(),
				},
				{
					id: StandardDialogButtonId.Ok,
					caption: { key: 'basics.common.button.send' },
					isDisabled: () => {
						return this.sendIsDisabled;
					},
				},
			],
			showCancelButton: true,
			showOkButton: false,
		});
		if (result?.closingButtonId === StandardDialogButtonId.Ok) {
			this.handleOk();
		}
	}

	/**
	 * worked when send email or fax button click
	 */
	private async handleOk() {
		const recipients = await this.getCommunicationList();
		const filteredRecipients = recipients.filter((recipient) => recipient.IsTo);

		if (filteredRecipients.length === 0) {
			this.dialogService.showMsgBox(this.translateService.instant(this.basicsCommonCommunicateTypes[this.communicationType].recipientText).text, this.translateService.instant(this.basicsCommonCommunicateTypes[this.communicationType].headerText).text, 'ico-info');
			return;
		}

		const emailFaxData = await this.getEmailOrFaxInfo(filteredRecipients);

		if (!emailFaxData) {
			console.error('Failed to prepare email data.');
			return;
		}

		// Disable the send button to prevent duplicate actions
		this.sendIsDisabled = true;

		await firstValueFrom(this.http.post(this.configService.webApiBaseUrl + 'procurement/rfq/wizard/sendemailorfax', emailFaxData))
			.then(() => {
				this.dialogService.showMsgBox(this.translateService.instant(this.basicsCommonCommunicateTypes[this.communicationType].successText).text, this.translateService.instant(this.basicsCommonCommunicateTypes[this.communicationType].headerText).text, 'ico-success');
			})
			.catch((error) => {
				console.error('Error sending email or fax:', error);
				this.dialogService.showMsgBox(this.translateService.instant(this.basicsCommonCommunicateTypes[this.communicationType].failText).text, this.translateService.instant(this.basicsCommonCommunicateTypes[this.communicationType].headerText).text, 'ico-error');
				this.sendIsDisabled = false; // Re-enable the send button on error
			});
	}

	/**
	 * To get Communication List
	 * @returns Promise<IPrcRfqEmailFaxRecipient[]>
	 */
	public async getCommunicationList(): Promise<IPrcRfqEmailFaxRecipient[]> {
		const mainItem = this.procurementRfqMainService.getSelectedEntity()?.Id;
		const req = { filter: '', Value: mainItem };
		const endRead = this.communicationType === 'email' ? 'emailrecipient' : 'faxrecipient';
		return await firstValueFrom(this.http.post<IPrcRfqEmailFaxRecipient[]>(this.configService.webApiBaseUrl + 'procurement/rfq/wizard/' + endRead, req)).catch((error) => {
			console.error('Error fetching recipients:', error);
			return [];
		});
	}

	/**
	 * get email or fax information.
	 * @param {IPrcRfqEmailFaxRecipient[]} recipients
	 * @returns {Promise<IEmailRequest>} emailRequest
	 */
	private async getEmailOrFaxInfo(recipients: IPrcRfqEmailFaxRecipient[]): Promise<IEmailRequest> {
		const mainItem = this.procurementRfqMainService.getSelectedEntity()!;

		const emailRequest: IEmailRequest = {
			RfqHeaderId: mainItem.Id,
			ReportId: this.boqReportTemplateItem ? this.boqReportTemplateItem.id : -1,
			ItemReportId: this.rfqReportTemplateItem ? this.rfqReportTemplateItem.id : -1,
			GaebExt: this.gaebFormatExt || null,
			EmailInfo: null,
			CommunicateType: this.communicationType,
			ItemGearDataName: '',
			BoqGearDataName: '',
		};

		const email: IEmailInfo = {
			Subject: this.generateEmailSubject(mainItem),
			Body: 'Please see the attachment. Thanks.',
			IsReportBody: this.communicationType === this.basicsCommonCommunicateTypes.email.name,
			Receivers: [],
			AttachmentRequests: [],
			BodyRequests: [],
		};

		recipients.forEach((recipient) => {
			if (recipient.IsTo && recipient.To) {
				const receiver: IReceiver = {
					Id: recipient.Id,
					To: recipient.To,
					BodyIds: [],
					AttachmentIds: [],
				};
				if (recipient.IsCc && recipient.Cc) {
					receiver.Cc = recipient.Cc;
				}

				const id = recipient.Id.toString();

				if (email.IsReportBody) {
					receiver.BodyIds.push(id);
				}
				receiver.AttachmentIds.push(id);

				const reportRequest = this.getRfqReportRequestData(mainItem.Id, recipient.BusinessPartnerId);
				if (!email.AttachmentRequests.find((req) => req.Id === id)) {
					email.AttachmentRequests.push({ Id: id, Request: reportRequest });
				}

				if (!email.BodyRequests.find((req) => req.Id === id)) {
					email.BodyRequests.push({ Id: id, Request: reportRequest });
				}

				email.Receivers.push(receiver);
			}
		});

		emailRequest.EmailInfo = email;
		return emailRequest;
	}

	/**
	 * Helper function to generate email subject
	 * @param {IRfqHeaderEntity} mainItem
	 * @returns {string} subject
	 */
	private generateEmailSubject(mainItem: IRfqHeaderEntity): string {
		if (!mainItem?.Code) {
			console.error('Invalid main item for email subject.');
			return 'Request for Quotation';
		}

		let subject = 'Request for Quotation -' + mainItem.Code;
		if (mainItem.Description) {
			subject += '-' + mainItem.Description;
		}
		return subject;
	}

	/**
	 * set(RfQ) report template data (which will generated as email attachment and body) for each receiver
	 * @param {number} rfqHeaderId
	 * @param {number} bizPartnerId
	 * @returns object
	 */
	private getRfqReportRequestData(rfqHeaderId: number, bizPartnerId: number): IReportRequest {
		return {
			ReportData: this.getReportData(this.rfqReportTemplateItem),
			GearData: { Name: 'pdf' },
			Parameters: this.getReportParametersOfRfq(rfqHeaderId, bizPartnerId).map((item: IReportParametersData) => ({
				Key: item.Name,
				Value: item,
			})),
		};
	}

	/**
	 * preview the selected reports.
	 */
	public previewReport(): void {
		const selectedEntity = this.procurementRfqMainService.getSelectedEntity();

		// Check if selectedEntity is not null or undefined before accessing its properties
		const rfqHeaderId = selectedEntity ? selectedEntity.Id : null;

		if (rfqHeaderId === null) {
			console.warn('Selected entity is null or undefined.');
			return;
		}
		let reportData: IReportPrepareData;
		let parameters: IReportParametersData[] = [];

		// Preview RFQ report
		if (this.rfqReportTemplateItem) {
			reportData = this.getReportData(this.rfqReportTemplateItem);
			parameters = this.getReportParametersOfRfq(rfqHeaderId, this.communicationType === this.basicsCommonCommunicateTypes.email.name ? -2 : -3);

			this.platformReportService.prepare(reportData, parameters, '').subscribe({ next: (result) => this.platformReportService.show(result) });
		}

		// Preview requisition BOQ reports
		if (this.boqReportTemplateItem) {
			this.procurementRfqRequisitionDataService.getList().forEach((item) => {
				reportData = this.getReportData(this.boqReportTemplateItem);
				parameters = this.getReportParametersOfRequisitionBoq(item.ReqHeaderFk);

				this.platformReportService.prepare(reportData, parameters, '').subscribe({ next: (result) => this.platformReportService.show(result) });
			});
		}

		// Preview requisition item reports
		if (this.rfqReportTemplateItem) {
			reportData = this.getReportData(this.rfqReportTemplateItem);
			parameters = this.getItemReportParametersOfRfq(rfqHeaderId);

			this.platformReportService.prepare(reportData, parameters, '').subscribe({ next: (result) => this.platformReportService.show(result) });
		}
	}

	/**
	 * Mock function to mimic getReportData
	 * @param {IReportData} report
	 * @returns {IReportPrepareData} reportData
	 */
	private getReportData(report: IReportData): IReportPrepareData {
		const reportData = {
			Id: report.id,
			Name: report.name,
			TemplateName: report.reports.find((x) => x.filename)?.filename ?? '',
			Path: report.reports.find((x) => x.path)?.path ?? '',
		};
		return reportData;
	}

	/**
	 * Function to generate report parameters for RfQ
	 * @param {number} rfqHeaderId
	 * @param {number} businessPartnerId
	 * @returns IReportParametersData[]
	 */
	private getReportParametersOfRfq(rfqHeaderId: number, businessPartnerId: number): IReportParametersData[] {
		return [
			{ Name: 'CompanyID', ParamValue: JSON.stringify(this.contextSrv.clientId), ParamValueType: 'System.Int32' },
			{ Name: 'RfqHeaderID', ParamValue: JSON.stringify(rfqHeaderId), ParamValueType: 'System.Int32' },
			{ Name: 'BusinessPartnerID', ParamValue: JSON.stringify(businessPartnerId || -1), ParamValueType: 'System.Int32' },
		];
	}

	/**
	 * Function to generate report parameters for Requisition Boq
	 * @param {number} rfqHeaderId
	 * @returns IReportParametersData[]
	 */
	private getReportParametersOfRequisitionBoq(reqHeaderId: number): IReportParametersData[] {
		return [
			{ Name: 'CompanyID', ParamValue: JSON.stringify(this.contextSrv.clientId), ParamValueType: 'System.Int32' },
			{ Name: 'ReqHeaderID', ParamValue: JSON.stringify(reqHeaderId), ParamValueType: 'System.Int32' },
			{ Name: 'BoQ', ParamValue: null, ParamValueType: 'System.String' },
		];
	}

	/**
	 * Function to generate report parameters for RfQ
	 * @param {number} rfqHeaderId
	 * @returns IReportParametersData[]
	 */
	private getItemReportParametersOfRfq(rfqHeaderId: number): IReportParametersData[] {
		return [
			{ Name: 'CompanyID', ParamValue: JSON.stringify(this.contextSrv.clientId), ParamValueType: 'System.Int32' },
			{ Name: 'RfqHeaderID', ParamValue: JSON.stringify(rfqHeaderId), ParamValueType: 'System.Int32' },
		];
	}
}
