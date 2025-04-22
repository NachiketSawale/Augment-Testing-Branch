import { Component, inject } from '@angular/core';
import { FieldType, IGridConfiguration } from '@libs/ui/common';
import { SendEmailOrFaxService } from '../../services/wizards/send-email-or-fax.service';
import { IRecipient } from '@libs/businesspartner/interfaces';


@Component({
	selector: 'businesspartner-certificate-email-recipient',
	templateUrl: './email-recipient.component.html',
	styleUrl: './email-recipient.component.scss',
})
export class BusinesspartnerCertificateEmailRecipientComponent {
	private readonly sendService = inject(SendEmailOrFaxService);

	public get recipientList(): IRecipient[] {
		return this.sendService.Model.RecipientList;
	}

	public gridConfig: IGridConfiguration<IRecipient> = {
		uuid: '6909ab3938e545fb96d0005cb94dc691',
		idProperty: 'Id',
		items: [],
		iconClass: null,
		skipPermissionCheck: true,
		enableColumnReorder: true,
		enableCopyPasteExcel: false,
		columns: [
			{
				id: 'IsCheckToSend',
				model: 'IsCheckToSend',
				label: {
					key: 'basics.common.wizardDialog.gridEntity.doesSend',
					text: 'Does Send'
				},
				type: FieldType.Boolean,
				sortable: false,
			},
			{
				id: 'BusinessPartnerName1',
				model: 'BusinessPartnerName1',
				label: {
					key: 'businesspartner.certificate.wizard.dialogEntity.bpName1',
					text: 'Business Partner Name'
				},
				type: FieldType.Description,
				readonly: true,
				sortable: false,
			},
			{
				id: 'Telefax',
				model: 'Telefax',
				label: {
					key: 'businesspartner.certificate.wizard.dialogEntity.fax',
					text: 'Fax'
				},
				type: FieldType.Description,
				readonly: true,
				sortable: false,
			},
			{
				id: 'Email',
				model: 'Email',
				label: {
					key: 'businesspartner.certificate.wizard.dialogEntity.email',
					text: 'E-Mail'
				},
				type: FieldType.Email,
				readonly: true,
				sortable: false,
			},
		],
	};
}