/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeBidTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeBidTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedBidTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeBidTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/bidtype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'bc54a170d2cb4332a6f97c8ed3a51172',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeBidTypeEntity) => x.DescriptionInfo),
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
						id: 'RubricCategoryFk',
						model: 'RubricCategoryFk',
						type: FieldType.Quantity,
						label: { text: 'RubricCategoryFk' },
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
						id: 'IsMain',
						model: 'IsMain',
						type: FieldType.Boolean,
						label: { text: 'IsMain' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsChange',
						model: 'IsChange',
						type: FieldType.Boolean,
						label: { text: 'IsChange' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsSide',
						model: 'IsSide',
						type: FieldType.Boolean,
						label: { text: 'IsSide' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
