/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeRythmEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeRythmEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedRythmLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeRythmEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/rythm/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'f35227cacb5946bdae32986dc084b1c2',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeRythmEntity) => x.DescriptionInfo),
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
