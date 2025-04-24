/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeEstLineItemStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeEstLineItemStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedEstLineItemStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeEstLineItemStatusEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/estlineitemstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '0c609589793343979b86e2dd3221a8cb',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeEstLineItemStatusEntity) => x.DescriptionInfo),
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
						id: 'Icon',
						model: 'Icon',
						type: FieldType.Quantity,
						label: { text: 'Icon' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsReadOnly',
						model: 'IsReadOnly',
						type: FieldType.Boolean,
						label: { text: 'IsReadOnly' },
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
