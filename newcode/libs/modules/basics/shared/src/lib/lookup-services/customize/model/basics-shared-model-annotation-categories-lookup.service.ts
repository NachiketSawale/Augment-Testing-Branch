/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeModelAnnotationCategoriesEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeModelAnnotationCategoriesEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedModelAnnotationCategoriesLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeModelAnnotationCategoriesEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/modelannotationcategories/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '078a398811e447f6a3933c06b8998b86',
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
						id: 'Color',
						model: 'Color',
						type: FieldType.Quantity,
						label: { text: 'Color' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
