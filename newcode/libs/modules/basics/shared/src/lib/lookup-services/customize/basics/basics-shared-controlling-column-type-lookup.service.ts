/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeControllingColumnTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeControllingColumnTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedControllingColumnTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeControllingColumnTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/controllingcolumntype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'a4f400d67dfb40b7997a8b30427169f3',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeControllingColumnTypeEntity) => x.DescriptionInfo),
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
