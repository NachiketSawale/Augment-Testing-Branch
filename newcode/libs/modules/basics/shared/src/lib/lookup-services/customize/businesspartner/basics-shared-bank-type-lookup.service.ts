/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeBankTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeBankTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedBankTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeBankTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/banktype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '25c1aef348ee414bbf5edc11fb0f0bd0',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeBankTypeEntity) => x.DescriptionInfo),
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
						id: 'Reference',
						model: 'Reference',
						type: FieldType.Description,
						label: { text: 'Reference' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
