/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeEquipmentPricingGroupEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeEquipmentPricingGroupEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedEquipmentPricingGroupLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeEquipmentPricingGroupEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/equipmentpricinggroup/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'e0329b332a1847bcaca2fdf9af9005cd',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeEquipmentPricingGroupEntity) => x.DescriptionInfo),
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
