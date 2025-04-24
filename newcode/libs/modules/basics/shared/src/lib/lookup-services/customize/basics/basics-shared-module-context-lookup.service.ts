/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeModuleContextEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeModuleContextEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedModuleContextLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeModuleContextEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/modulecontext/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'b377e84f761c486192d254e6c1f25ccf',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeModuleContextEntity) => x.DescriptionInfo),
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
