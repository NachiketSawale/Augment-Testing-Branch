/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePlantKindEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePlantKindEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPlantKindLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePlantKindEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/plantkind/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'db50aec1f77441e79d72ebbd1c690476',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizePlantKindEntity) => x.DescriptionInfo),
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
