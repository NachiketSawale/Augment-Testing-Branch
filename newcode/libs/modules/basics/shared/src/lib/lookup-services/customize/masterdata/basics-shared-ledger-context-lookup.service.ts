/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeLedgerContextEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeLedgerContextEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedLedgerContextLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeLedgerContextEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/ledgercontext/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '9e4bcffe69ab4edba832c6a5c9917f2c',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeLedgerContextEntity) => x.DescriptionInfo),
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
