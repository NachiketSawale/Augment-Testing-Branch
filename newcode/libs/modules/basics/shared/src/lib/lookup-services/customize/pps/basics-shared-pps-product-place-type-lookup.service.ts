/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePpsProductPlaceTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePpsProductPlaceTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPpsProductPlaceTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePpsProductPlaceTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/ppsproductplacetype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '203dee6a51ee4b99b8c33d207b3035c6',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizePpsProductPlaceTypeEntity) => x.DescriptionInfo),
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
						id: 'IsDefault',
						model: 'IsDefault',
						type: FieldType.Boolean,
						label: { text: 'IsDefault' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsFixed',
						model: 'IsFixed',
						type: FieldType.Boolean,
						label: { text: 'IsFixed' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'CanHaveChildren',
						model: 'CanHaveChildren',
						type: FieldType.Boolean,
						label: { text: 'CanHaveChildren' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsManual',
						model: 'IsManual',
						type: FieldType.Boolean,
						label: { text: 'IsManual' },
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
					},
					{
						id: 'Icon',
						model: 'Icon',
						type: FieldType.Quantity,
						label: { text: 'Icon' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
