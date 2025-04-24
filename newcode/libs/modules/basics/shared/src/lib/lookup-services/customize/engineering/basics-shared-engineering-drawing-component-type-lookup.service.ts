/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeEngineeringDrawingComponentTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeEngineeringDrawingComponentTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedEngineeringDrawingComponentTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeEngineeringDrawingComponentTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/engineeringdrawingcomponenttype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '566c19a6f392444cbd1d2e9f7fa0ee44',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeEngineeringDrawingComponentTypeEntity) => x.DescriptionInfo),
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
						id: 'Icon',
						model: 'Icon',
						type: FieldType.Quantity,
						label: { text: 'Icon' },
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
