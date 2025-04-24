/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePpsReproductionReasonEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePpsReproductionReasonEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPpsReproductionReasonLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePpsReproductionReasonEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/ppsreproductionreason/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '9bc65d81412947b5b28d5d928a3c28b8',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizePpsReproductionReasonEntity) => x.DescriptionInfo),
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
						id: 'IsWithEngineering',
						model: 'IsWithEngineering',
						type: FieldType.Boolean,
						label: { text: 'IsWithEngineering' },
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
