/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeClerkDocumentTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeClerkDocumentTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedClerkDocumentTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeClerkDocumentTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/clerkdocumenttype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '59019885fa714a039cb9e6d4b31d8e0c',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeClerkDocumentTypeEntity) => x.DescriptionInfo),
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
