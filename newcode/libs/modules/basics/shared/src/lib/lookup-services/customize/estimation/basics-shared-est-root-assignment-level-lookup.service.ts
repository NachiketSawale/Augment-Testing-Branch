/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeEstRootAssignmentLevelEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeEstRootAssignmentLevelEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedEstRootAssignmentLevelLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeEstRootAssignmentLevelEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/estrootassignmentlevel/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'a3d10ca38cfc442c8d61a87fb83d0116',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeEstRootAssignmentLevelEntity) => x.DescriptionInfo),
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
