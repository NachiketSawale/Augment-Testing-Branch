/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeCharacteristicTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeCharacteristicTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedCharacteristicTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeCharacteristicTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/characteristictype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '375f932ba38c4a56bdd7be30385a6415',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeCharacteristicTypeEntity) => x.DescriptionInfo),
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
