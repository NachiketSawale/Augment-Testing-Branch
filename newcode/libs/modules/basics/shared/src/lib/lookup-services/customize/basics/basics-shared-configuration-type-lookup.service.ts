/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeConfigurationTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeConfigurationTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedConfigurationTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeConfigurationTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/configurationtype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '91f29a899bfa49429be60d622371570a',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeConfigurationTypeEntity) => x.DescriptionInfo),
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
						id: 'IsSales',
						model: 'IsSales',
						type: FieldType.Boolean,
						label: { text: 'IsSales' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsProcurement',
						model: 'IsProcurement',
						type: FieldType.Boolean,
						label: { text: 'IsProcurement' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
