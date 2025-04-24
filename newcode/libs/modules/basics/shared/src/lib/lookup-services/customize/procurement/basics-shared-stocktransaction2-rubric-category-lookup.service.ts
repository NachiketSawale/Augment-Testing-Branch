/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeStocktransaction2RubricCategoryEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeStocktransaction2RubricCategoryEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedStocktransaction2RubricCategoryLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeStocktransaction2RubricCategoryEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/stocktransaction2rubriccategory/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '8c7fe7e4480d49d6b44c9010875c6e2a',
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
						id: 'StockTransactionTypeFk',
						model: 'StockTransactionTypeFk',
						type: FieldType.Quantity,
						label: { text: 'StockTransactionTypeFk' },
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
