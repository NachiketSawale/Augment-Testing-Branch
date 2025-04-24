/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeCostGroupPortionEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeCostGroupPortionEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedCostGroupPortionLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeCostGroupPortionEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/costgroupportion/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'ea30160d1a39408e954b9232c5116309',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeCostGroupPortionEntity) => x.DescriptionInfo),
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
