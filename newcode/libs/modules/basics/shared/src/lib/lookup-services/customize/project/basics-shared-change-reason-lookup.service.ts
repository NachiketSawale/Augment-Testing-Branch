/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeChangeReasonEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeChangeReasonEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedChangeReasonLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeChangeReasonEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/changereason/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '6918ed5b994846138cdf967b8d87ec6c',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeChangeReasonEntity) => x.DescriptionInfo),
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
					}
				]
			}
		});
	}
}
