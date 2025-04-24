/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeRegionTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeRegionTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedRegionTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeRegionTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/regiontype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '009c6c00e49d46809577730baa41cce3',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeRegionTypeEntity) => x.DescriptionInfo),
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
						id: 'Isintrastat',
						model: 'Isintrastat',
						type: FieldType.Boolean,
						label: { text: 'Isintrastat' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
