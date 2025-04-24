/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeSalesDocumentTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeSalesDocumentTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedSalesDocumentTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeSalesDocumentTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/salesdocumenttype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '8f6c9f9b8a2e4c74a7003f8493c73d58',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeSalesDocumentTypeEntity) => x.DescriptionInfo),
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
