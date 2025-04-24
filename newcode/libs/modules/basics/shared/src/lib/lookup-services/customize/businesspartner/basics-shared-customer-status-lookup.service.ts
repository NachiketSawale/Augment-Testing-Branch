/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeCustomerStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeCustomerStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedCustomerStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeCustomerStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/customerstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '4586812bd656495dbbfc25f1a535e1de',
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
						id: 'Accountingvalue',
						model: 'Accountingvalue',
						type: FieldType.Description,
						label: { text: 'Accountingvalue' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsDeactivated',
						model: 'IsDeactivated',
						type: FieldType.Boolean,
						label: { text: 'IsDeactivated' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
