/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeDunningGroupEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeDunningGroupEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedDunningGroupLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeDunningGroupEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/dunninggroup/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'cbcfd57fe17f41029beb8f54962dbb3e',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeDunningGroupEntity) => x.DescriptionInfo),
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
						id: 'Codefinance',
						model: 'Codefinance',
						type: FieldType.Description,
						label: { text: 'Codefinance' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
