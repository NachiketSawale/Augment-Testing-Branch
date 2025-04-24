/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeBoqStandardEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeBoqStandardEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedBoqStandardLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeBoqStandardEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/boqstandard/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '009ade8a789a4d45843b63146ad9717e',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeBoqStandardEntity) => x.DescriptionInfo),
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
