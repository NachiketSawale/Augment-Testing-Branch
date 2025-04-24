/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeRadiusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeRadiusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedRadiusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeRadiusEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/radius/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'ee1253d2464e48c3b61e3187a643224f',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeRadiusEntity) => x.DescriptionInfo),
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
						id: 'Radiusinmeter',
						model: 'Radiusinmeter',
						type: FieldType.Quantity,
						label: { text: 'Radiusinmeter' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UomFk',
						model: 'UomFk',
						type: FieldType.Quantity,
						label: { text: 'UomFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
