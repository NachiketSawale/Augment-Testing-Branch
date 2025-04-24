/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTimeSymbolTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTimeSymbolTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTimeSymbolTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTimeSymbolTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/timesymboltype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'd300ba605cc44cceb8e3fb1b0791ddde',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeTimeSymbolTypeEntity) => x.DescriptionInfo),
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
						id: 'Reference',
						model: 'Reference',
						type: FieldType.Description,
						label: { text: 'Reference' },
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
