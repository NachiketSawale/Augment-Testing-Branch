/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeContactRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeContactRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedContactRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeContactRoleEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/contactrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'c219c64845b84db2851594bbc2602daf',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeContactRoleEntity) => x.DescriptionInfo),
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
						id: 'IsForCertificate',
						model: 'IsForCertificate',
						type: FieldType.Boolean,
						label: { text: 'IsForCertificate' },
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
