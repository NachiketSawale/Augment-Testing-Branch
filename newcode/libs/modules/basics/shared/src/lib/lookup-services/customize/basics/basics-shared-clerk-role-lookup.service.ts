/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeClerkRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeClerkRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedClerkRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeClerkRoleEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/clerkrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '2189aeeadb704c8f9ef209b92727bdac',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeClerkRoleEntity) => x.DescriptionInfo),
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
						id: 'IsUnique',
						model: 'IsUnique',
						type: FieldType.Boolean,
						label: { text: 'IsUnique' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsForPackageAccess',
						model: 'IsForPackageAccess',
						type: FieldType.Boolean,
						label: { text: 'IsForPackageAccess' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsForPackage',
						model: 'IsForPackage',
						type: FieldType.Boolean,
						label: { text: 'IsForPackage' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsForContract',
						model: 'IsForContract',
						type: FieldType.Boolean,
						label: { text: 'IsForContract' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsForContractAccess',
						model: 'IsForContractAccess',
						type: FieldType.Boolean,
						label: { text: 'IsForContractAccess' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsForProject',
						model: 'IsForProject',
						type: FieldType.Boolean,
						label: { text: 'IsForProject' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsForStock',
						model: 'IsForStock',
						type: FieldType.Boolean,
						label: { text: 'IsForStock' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
