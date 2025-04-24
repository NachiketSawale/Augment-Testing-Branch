/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeSalesDateKindEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeSalesDateKindEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedSalesDateKindLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeSalesDateKindEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/salesdatekind/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'cb905cba18b04ae99e72fd583a63db48',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeSalesDateKindEntity) => x.DescriptionInfo),
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
