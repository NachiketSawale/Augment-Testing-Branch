/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeAwardMethodEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeAwardMethodEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedAwardMethodLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeAwardMethodEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/awardmethod/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'c606c4a797e64921913b8e539ff934f1',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeAwardMethodEntity) => x.DescriptionInfo),
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
						id: 'TxAwardmethod',
						model: 'TxAwardmethod',
						type: FieldType.Quantity,
						label: { text: 'TxAwardmethod' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'TxAuthoritycode',
						model: 'TxAuthoritycode',
						type: FieldType.Description,
						label: { text: 'TxAuthoritycode' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'TxLot',
						model: 'TxLot',
						type: FieldType.Boolean,
						label: { text: 'TxLot' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
