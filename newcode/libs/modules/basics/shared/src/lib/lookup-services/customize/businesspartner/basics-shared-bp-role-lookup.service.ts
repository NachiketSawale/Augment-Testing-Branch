/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeBpRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeBpRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedBpRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeBpRoleEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/bprole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '32ad46dd9b98455baf3cd975ac19b9d1',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeBpRoleEntity) => x.DescriptionInfo),
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
						id: 'Isfixed',
						model: 'Isfixed',
						type: FieldType.Boolean,
						label: { text: 'Isfixed' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsClient',
						model: 'IsClient',
						type: FieldType.Boolean,
						label: { text: 'IsClient' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
