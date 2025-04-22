/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, inject } from '@angular/core';
import { PlatformAuthService } from '@libs/platform/authentication';
import { FieldType, IFormConfig } from '@libs/ui/common';
import { ISenderEntity } from '../../model/entities/prc-rfq-email-fax-info.interface';

/**
 * Represent Procurement Rfq Sender Email Or Fax component.
 */
@Component({
	selector: 'procurement-rfq-email-fax-sender',
	templateUrl: './procurement-rfq-email-fax-sender.component.html',
	styleUrl: './procurement-rfq-email-fax-sender.component.css',
})
export class ProcurementRfqEmailFaxSenderComponent {
	private readonly authService = inject(PlatformAuthService);
	public userInfo: ISenderEntity = {
		userName: '',
		password: '',
	};

	public constructor() {
		this.authService.getUserData().subscribe((userData) => {
			this.userInfo.userName = userData.email;
		});
	}

	public formConfig: IFormConfig<ISenderEntity> = {
		formId: 'basics.common.communicate.account',
		showGrouping: false,
		rows: [
			{
				id: 'Username',
				label: {
					key: 'platform.loginUsername',
					text: 'Username',
				},
				type: FieldType.Email,
				model: 'userName',
				required: true,
			},
			{
				id: 'Password',
				label: {
					key: 'platform.loginPassword',
					text: 'Password',
				},
				type: FieldType.Password,
				model: 'password',
				required: true,
			},
		],
	};
}
