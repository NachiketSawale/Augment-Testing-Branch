/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeModelObjectSetTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeModelObjectSetTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedModelObjectSetTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeModelObjectSetTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/modelobjectsettype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'c247b6b1dccb43c59668f87d07129849',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeModelObjectSetTypeEntity) => x.DescriptionInfo),
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
						id: 'IsIFCGroupType',
						model: 'IsIFCGroupType',
						type: FieldType.Boolean,
						label: { text: 'IsIFCGroupType' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsIFCZoneType',
						model: 'IsIFCZoneType',
						type: FieldType.Boolean,
						label: { text: 'IsIFCZoneType' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
