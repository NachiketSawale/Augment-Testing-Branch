/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePrcEventtypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePrcEventtypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPrcEventtypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePrcEventtypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/prceventtype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '4a7f886ff0b24f56864e0e46fa91087c',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizePrcEventtypeEntity) => x.DescriptionInfo),
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
						id: 'Ismainevent',
						model: 'Ismainevent',
						type: FieldType.Boolean,
						label: { text: 'Ismainevent' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Hasstartdate',
						model: 'Hasstartdate',
						type: FieldType.Boolean,
						label: { text: 'Hasstartdate' },
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
					},
					{
						id: 'SystemeventtypeStartFk',
						model: 'SystemeventtypeStartFk',
						type: FieldType.Quantity,
						label: { text: 'SystemeventtypeStartFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'SystemeventtypeEndFk',
						model: 'SystemeventtypeEndFk',
						type: FieldType.Quantity,
						label: { text: 'SystemeventtypeEndFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
