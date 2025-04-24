/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeBillCategoryDefaultEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeBillCategoryDefaultEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedBillCategoryDefaultLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeBillCategoryDefaultEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/billcategorydefault/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '41a369677f57490bb00067e56c0c7afa',
			valueMember: 'Id',
			displayMember: 'RubricCategoryFk',
			gridConfig: {
				columns: [
					{
						id: 'RubricCategoryFk',
						model: 'RubricCategoryFk',
						type: FieldType.Quantity,
						label: { text: 'RubricCategoryFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'VoucherTypeFk',
						model: 'VoucherTypeFk',
						type: FieldType.Quantity,
						label: { text: 'VoucherTypeFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'InvoiceTypeFk',
						model: 'InvoiceTypeFk',
						type: FieldType.Quantity,
						label: { text: 'InvoiceTypeFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
