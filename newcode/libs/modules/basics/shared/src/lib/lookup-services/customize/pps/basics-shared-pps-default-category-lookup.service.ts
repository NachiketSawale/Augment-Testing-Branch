/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePpsDefaultCategoryEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePpsDefaultCategoryEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPpsDefaultCategoryLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePpsDefaultCategoryEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/ppsdefaultcategory/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '82de0ac4c8aa4bfa8a3c7c34c2b9dcc1',
			valueMember: 'Id',
			displayMember: 'EntityFk',
			gridConfig: {
				columns: [
					{
						id: 'EntityFk',
						model: 'EntityFk',
						type: FieldType.Quantity,
						label: { text: 'EntityFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
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
						id: 'CommentText',
						model: 'CommentText',
						type: FieldType.Comment,
						label: { text: 'CommentText' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
