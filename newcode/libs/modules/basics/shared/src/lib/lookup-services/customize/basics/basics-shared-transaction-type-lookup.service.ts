/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTransactionTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTransactionTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTransactionTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTransactionTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/transactiontype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '7d3111a7224345c3863e7364a08a32a3',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeTransactionTypeEntity) => x.DescriptionInfo),
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
						id: 'Abbreviation',
						model: 'Abbreviation',
						type: FieldType.Code,
						label: { text: 'Abbreviation' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Postingarea',
						model: 'Postingarea',
						type: FieldType.Quantity,
						label: { text: 'Postingarea' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ValueTypeFk',
						model: 'ValueTypeFk',
						type: FieldType.Quantity,
						label: { text: 'ValueTypeFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
