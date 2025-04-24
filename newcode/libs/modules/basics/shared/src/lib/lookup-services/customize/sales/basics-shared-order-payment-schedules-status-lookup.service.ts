/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeOrderPaymentSchedulesStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeOrderPaymentSchedulesStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedOrderPaymentSchedulesStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeOrderPaymentSchedulesStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/orderpaymentschedulesstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '43563a513b294bbdbb1800af38a93c0d',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'Code',
						model: 'Code',
						type: FieldType.Code,
						label: { text: 'Code' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'DescriptionInfo',
						model: 'DescriptionInfo',
						type: FieldType.Translation,
						label: { text: 'DescriptionInfo' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsDefault',
						model: 'IsDefault',
						type: FieldType.Boolean,
						label: { text: 'IsDefault' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Icon',
						model: 'Icon',
						type: FieldType.Quantity,
						label: { text: 'Icon' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsAgreed',
						model: 'IsAgreed',
						type: FieldType.Boolean,
						label: { text: 'IsAgreed' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsIssued',
						model: 'IsIssued',
						type: FieldType.Boolean,
						label: { text: 'IsIssued' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsReadOnly',
						model: 'IsReadOnly',
						type: FieldType.Boolean,
						label: { text: 'IsReadOnly' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
