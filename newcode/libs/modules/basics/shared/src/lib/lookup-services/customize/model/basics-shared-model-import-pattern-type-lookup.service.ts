/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeModelImportPatternTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeModelImportPatternTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedModelImportPatternTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeModelImportPatternTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/modelimportpatterntype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'cd3815519bf5449ba1342fe455dbd8d3',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeModelImportPatternTypeEntity) => x.DescriptionInfo),
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
