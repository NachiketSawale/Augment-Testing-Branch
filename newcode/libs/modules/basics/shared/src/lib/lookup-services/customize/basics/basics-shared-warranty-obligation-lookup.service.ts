/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeWarrantyObligationEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeWarrantyObligationEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedWarrantyObligationLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeWarrantyObligationEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/warrantyobligation/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '791ef38dccf1443da82bb9be06911042',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeWarrantyObligationEntity) => x.DescriptionInfo),
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
