/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeResourceContextEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeResourceContextEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedResourceContextLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeResourceContextEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/resourcecontext/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '03cc649281904e85a51208d20a3cf17e',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeResourceContextEntity) => x.DescriptionInfo),
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
						id: 'CategoryrequisitionFk',
						model: 'CategoryrequisitionFk',
						type: FieldType.Quantity,
						label: { text: 'CategoryrequisitionFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
