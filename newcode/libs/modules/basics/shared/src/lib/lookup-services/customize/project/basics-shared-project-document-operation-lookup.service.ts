/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeProjectDocumentOperationEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeProjectDocumentOperationEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedProjectDocumentOperationLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeProjectDocumentOperationEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/projectdocumentoperation/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '17fe8828ebb4417c9fa8475fd18956d6',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeProjectDocumentOperationEntity) => x.DescriptionInfo),
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
					}
				]
			}
		});
	}
}
