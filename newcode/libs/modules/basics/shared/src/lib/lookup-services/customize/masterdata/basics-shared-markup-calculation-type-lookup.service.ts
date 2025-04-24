/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeMarkupCalculationTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeMarkupCalculationTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedMarkupCalculationTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeMarkupCalculationTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/markupcalculationtype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'bb674060a93c4c3ea58fcc5aa7043dab',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeMarkupCalculationTypeEntity) => x.DescriptionInfo),
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
