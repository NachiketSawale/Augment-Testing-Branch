/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeProjectDocumentCategory2TypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeProjectDocumentCategory2TypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedProjectDocumentCategory2TypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeProjectDocumentCategory2TypeEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/projectdocumentcategory2type/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '771a99a430f84cbaa02e2a3a9fabbcd1',
			valueMember: 'Id',
			displayMember: 'DocumentCategoryFk',
			gridConfig: {
				columns: [
					{
						id: 'DocumentCategoryFk',
						model: 'DocumentCategoryFk',
						type: FieldType.Quantity,
						label: { text: 'DocumentCategoryFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'DocumentTypeFk',
						model: 'DocumentTypeFk',
						type: FieldType.Quantity,
						label: { text: 'DocumentTypeFk' },
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
