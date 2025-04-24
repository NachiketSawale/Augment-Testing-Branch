/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeWarrantySecurityEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeWarrantySecurityEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedWarrantySecurityLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeWarrantySecurityEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/warrantysecurity/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'feef31a77d6e43809d45a78d76a07ea5',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeWarrantySecurityEntity) => x.DescriptionInfo),
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
