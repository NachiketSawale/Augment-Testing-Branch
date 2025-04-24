/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeEstTotalsConfigTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeEstTotalsConfigTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedEstTotalsConfigTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeEstTotalsConfigTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/esttotalsconfigtype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '4a309abad07c4bdea053ddfe399cf8ea',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeEstTotalsConfigTypeEntity) => x.DescriptionInfo),
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
						id: 'TotalsconfigFk',
						model: 'TotalsconfigFk',
						type: FieldType.Quantity,
						label: { text: 'TotalsconfigFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ContextFk',
						model: 'ContextFk',
						type: FieldType.Quantity,
						label: { text: 'ContextFk' },
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
