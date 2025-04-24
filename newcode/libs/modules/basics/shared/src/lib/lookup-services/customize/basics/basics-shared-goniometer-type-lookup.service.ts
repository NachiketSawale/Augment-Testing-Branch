/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeGoniometerTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeGoniometerTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedGoniometerTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeGoniometerTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/goniometertype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '14ed550eb9694922bb9aa64846bdfdb9',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeGoniometerTypeEntity) => x.DescriptionInfo),
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
					}
				]
			}
		});
	}
}
