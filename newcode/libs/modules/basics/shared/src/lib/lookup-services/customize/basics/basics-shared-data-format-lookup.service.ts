/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeDataFormatEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeDataFormatEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedDataFormatLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeDataFormatEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/dataformat/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'd797de5feb3a49a6b000bf4304f3d85d',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeDataFormatEntity) => x.DescriptionInfo),
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
						id: 'Isboq',
						model: 'Isboq',
						type: FieldType.Boolean,
						label: { text: 'Isboq' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Ismaterial',
						model: 'Ismaterial',
						type: FieldType.Boolean,
						label: { text: 'Ismaterial' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
