/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeRfITypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeRfITypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedRfITypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeRfITypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/rfitype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'd41af1ef9e434610b59fa5af24d8bef7',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeRfITypeEntity) => x.DescriptionInfo),
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
