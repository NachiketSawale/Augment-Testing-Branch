/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeCatalogAssignTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeCatalogAssignTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedCatalogAssignTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeCatalogAssignTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/catalogassigntype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '1082d0fd82aa4833b3cec780bdc257b0',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeCatalogAssignTypeEntity) => x.DescriptionInfo),
			gridConfig: {
				columns: [
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
						id: 'CatAssignFk',
						model: 'CatAssignFk',
						type: FieldType.Quantity,
						label: { text: 'CatAssignFk' },
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
						id: 'LineitemcontextFk',
						model: 'LineitemcontextFk',
						type: FieldType.Quantity,
						label: { text: 'LineitemcontextFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
