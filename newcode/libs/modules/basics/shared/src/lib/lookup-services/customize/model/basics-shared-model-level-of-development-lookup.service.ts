/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeModelLevelOfDevelopmentEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeModelLevelOfDevelopmentEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedModelLevelOfDevelopmentLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeModelLevelOfDevelopmentEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/modellevelofdevelopment/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '4d37695c18854c45bede60949e35ab8e',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeModelLevelOfDevelopmentEntity) => x.DescriptionInfo),
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
