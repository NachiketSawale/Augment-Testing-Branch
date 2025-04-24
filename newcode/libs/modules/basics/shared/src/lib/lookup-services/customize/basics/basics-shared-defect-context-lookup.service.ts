/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeDefectContextEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeDefectContextEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedDefectContextLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeDefectContextEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/defectcontext/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'ad5f9b67adfa41f4bdfef97d1a4aa26b',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeDefectContextEntity) => x.DescriptionInfo),
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
