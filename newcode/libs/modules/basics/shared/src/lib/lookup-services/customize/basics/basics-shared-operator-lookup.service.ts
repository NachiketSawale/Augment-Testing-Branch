/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeOperatorEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeOperatorEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedOperatorLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeOperatorEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/operator/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '17c3822cb1d84a5c8769cdf4c102791c',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeOperatorEntity) => x.DescriptionInfo),
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
						id: 'ConditionTypeFk',
						model: 'ConditionTypeFk',
						type: FieldType.Quantity,
						label: { text: 'ConditionTypeFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'DisplaydomainFk',
						model: 'DisplaydomainFk',
						type: FieldType.Quantity,
						label: { text: 'DisplaydomainFk' },
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
