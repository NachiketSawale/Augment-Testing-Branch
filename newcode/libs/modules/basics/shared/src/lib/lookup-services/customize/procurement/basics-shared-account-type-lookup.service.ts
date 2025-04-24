/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeAccountTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeAccountTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedAccountTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeAccountTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/accounttype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'e4389beaecc64d8f8efb7f3ef91d7d4c',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeAccountTypeEntity) => x.DescriptionInfo),
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
						id: 'Icon1',
						model: 'Icon1',
						type: FieldType.Quantity,
						label: { text: 'Icon1' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Icon2',
						model: 'Icon2',
						type: FieldType.Quantity,
						label: { text: 'Icon2' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'AccountlookupFk',
						model: 'AccountlookupFk',
						type: FieldType.Quantity,
						label: { text: 'AccountlookupFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
