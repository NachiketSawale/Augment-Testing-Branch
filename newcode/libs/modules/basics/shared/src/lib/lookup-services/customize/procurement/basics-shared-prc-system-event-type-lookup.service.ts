/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePrcSystemEventTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePrcSystemEventTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPrcSystemEventTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePrcSystemEventTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/prcsystemeventtype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '009e6713eae04fc197a08009c866b9b9',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizePrcSystemEventTypeEntity) => x.DescriptionInfo),
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
						id: 'EventtypeFk',
						model: 'EventtypeFk',
						type: FieldType.Quantity,
						label: { text: 'EventtypeFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
