/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeProjectChanceEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeProjectChanceEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedProjectChanceLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeProjectChanceEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/projectchance/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'd0ce8d9c565946f7943afafa8f1ffb2e',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeProjectChanceEntity) => x.DescriptionInfo),
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
						id: 'Chance',
						model: 'Chance',
						type: FieldType.Quantity,
						label: { text: 'Chance' },
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
