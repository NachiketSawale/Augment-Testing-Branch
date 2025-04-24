/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeSalesTaxGroupEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeSalesTaxGroupEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedSalesTaxGroupLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeSalesTaxGroupEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/salestaxgroup/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'adffaf9937bd4fa18df7507f2b171952',
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
						id: 'LedgerContextFk',
						model: 'LedgerContextFk',
						type: FieldType.Quantity,
						label: { text: 'LedgerContextFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Reference',
						model: 'Reference',
						type: FieldType.Description,
						label: { text: 'Reference' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'CommentText',
						model: 'CommentText',
						type: FieldType.Description,
						label: { text: 'CommentText' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefined01',
						model: 'UserDefined01',
						type: FieldType.Description,
						label: { text: 'UserDefined01' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefined02',
						model: 'UserDefined02',
						type: FieldType.Description,
						label: { text: 'UserDefined02' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefined03',
						model: 'UserDefined03',
						type: FieldType.Description,
						label: { text: 'UserDefined03' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
