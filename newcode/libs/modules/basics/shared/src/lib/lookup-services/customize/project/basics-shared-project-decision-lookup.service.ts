/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeProjectDecisionEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeProjectDecisionEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedProjectDecisionLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeProjectDecisionEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/projectdecision/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'f2b2b32d3f6244caa85a6b6c15a78882',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeProjectDecisionEntity) => x.DescriptionInfo),
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
