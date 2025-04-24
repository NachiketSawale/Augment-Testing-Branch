/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeQuantityTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeQuantityTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedQuantityTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeQuantityTypeEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/quantitytype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'f9f8ac45722a48d5a1f4ece596836c44',
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
						id: 'CommentText',
						model: 'CommentText',
						type: FieldType.Comment,
						label: { text: 'CommentText' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Iseditable',
						model: 'Iseditable',
						type: FieldType.Boolean,
						label: { text: 'Iseditable' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isusercontrolled',
						model: 'Isusercontrolled',
						type: FieldType.Boolean,
						label: { text: 'Isusercontrolled' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Ismaintable',
						model: 'Ismaintable',
						type: FieldType.Boolean,
						label: { text: 'Ismaintable' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
