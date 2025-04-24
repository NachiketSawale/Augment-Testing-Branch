/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeProjectContractRoleTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeProjectContractRoleTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedProjectContractRoleTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeProjectContractRoleTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/projectcontractroletype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'e82b346504be4fb2a92d66362c389b92',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeProjectContractRoleTypeEntity) => x.DescriptionInfo),
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
