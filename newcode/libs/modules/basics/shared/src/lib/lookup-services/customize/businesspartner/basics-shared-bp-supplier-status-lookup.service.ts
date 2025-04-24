/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeBpSupplierStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeBpSupplierStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedBpSupplierStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeBpSupplierStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/bpsupplierstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'ffd2e807718344e3a0ea8d4d5725dcab',
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
						id: 'AccountingValue',
						model: 'AccountingValue',
						type: FieldType.Description,
						label: { text: 'AccountingValue' },
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
