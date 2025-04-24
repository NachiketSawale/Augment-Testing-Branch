/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeProjectQuantityControlEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeProjectQuantityControlEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedProjectQuantityControlLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeProjectQuantityControlEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/projectquantitycontrol/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'd6abe4e0fe584a5bb3455f8785361f6c',
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
					}
				]
			}
		});
	}
}
