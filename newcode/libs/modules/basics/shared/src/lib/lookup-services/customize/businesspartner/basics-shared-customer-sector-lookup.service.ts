/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeCustomerSectorEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeCustomerSectorEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedCustomerSectorLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeCustomerSectorEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/customersector/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'bbc6345adf6e48a48c78cf4f56bf5bd4',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeCustomerSectorEntity) => x.DescriptionInfo),
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
