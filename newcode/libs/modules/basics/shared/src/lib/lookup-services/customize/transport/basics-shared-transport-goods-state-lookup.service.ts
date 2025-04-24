/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTransportGoodsStateEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTransportGoodsStateEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTransportGoodsStateLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTransportGoodsStateEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/transportgoodsstate/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '72bc4400fdcd42ec95d5c925dfd631ca',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeTransportGoodsStateEntity) => x.DescriptionInfo),
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
						id: 'Color',
						model: 'Color',
						type: FieldType.Quantity,
						label: { text: 'Color' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
