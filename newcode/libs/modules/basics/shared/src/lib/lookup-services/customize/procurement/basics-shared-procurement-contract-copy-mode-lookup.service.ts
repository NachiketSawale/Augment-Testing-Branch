/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeProcurementContractCopyModeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeProcurementContractCopyModeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedProcurementContractCopyModeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeProcurementContractCopyModeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/procurementcontractcopymode/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'a7f69966e5614d13af79968f2c5db3c7',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeProcurementContractCopyModeEntity) => x.DescriptionInfo),
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
