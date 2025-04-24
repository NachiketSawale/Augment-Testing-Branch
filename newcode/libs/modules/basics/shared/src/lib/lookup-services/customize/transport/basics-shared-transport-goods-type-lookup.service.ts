/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTransportGoodsTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTransportGoodsTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTransportGoodsTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTransportGoodsTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/transportgoodstype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'fc20b4a99a124cd5a899a1dfe39ebede',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeTransportGoodsTypeEntity) => x.DescriptionInfo),
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
