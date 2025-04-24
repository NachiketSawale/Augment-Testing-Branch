/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeQtoLineTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeQtoLineTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedQtoLineTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeQtoLineTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/qtolinetype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '47a6d13b2326457ab23eb67dd5400642',
			valueMember: 'Id',
			displayMember: 'Code',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeQtoLineTypeEntity) => x.DescriptionInfo),
			gridConfig: {
				columns: [
					{
						id: 'Code',
						model: 'Code',
						type: FieldType.Translation,
						label: { text: 'Code' },
						sortable: true,
						visible: true,
						readonly: true
					},
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
