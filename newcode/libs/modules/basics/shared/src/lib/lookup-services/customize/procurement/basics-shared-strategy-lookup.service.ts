/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeStrategyEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeStrategyEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedStrategyLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeStrategyEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/strategy/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'd7782385022e47c9ab9ee4952154cecb',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeStrategyEntity) => x.DescriptionInfo),
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
