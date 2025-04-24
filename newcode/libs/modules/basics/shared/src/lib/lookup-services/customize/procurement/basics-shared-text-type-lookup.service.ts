/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTextTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTextTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTextTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTextTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/texttype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'cc2eb2f0ac1f4e89a9b05aa83a70656a',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeTextTypeEntity) => x.DescriptionInfo),
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
						id: 'Forheader',
						model: 'Forheader',
						type: FieldType.Boolean,
						label: { text: 'Forheader' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Foritem',
						model: 'Foritem',
						type: FieldType.Boolean,
						label: { text: 'Foritem' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
