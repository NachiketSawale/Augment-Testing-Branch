/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTransportGoodsOnTimeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTransportGoodsOnTimeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTransportGoodsOnTimeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTransportGoodsOnTimeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/transportgoodsontime/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '114afa13a46b483fb7e43107e0999cd2',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeTransportGoodsOnTimeEntity) => x.DescriptionInfo),
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
