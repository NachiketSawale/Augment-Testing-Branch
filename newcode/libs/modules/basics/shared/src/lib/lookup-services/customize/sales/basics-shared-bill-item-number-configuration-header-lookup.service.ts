/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeBillItemNumberConfigurationHeaderEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeBillItemNumberConfigurationHeaderEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedBillItemNumberConfigurationHeaderLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeBillItemNumberConfigurationHeaderEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/billitemnumberconfigurationheader/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'ec2850091e1345f9a729768542328f07',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeBillItemNumberConfigurationHeaderEntity) => x.DescriptionInfo),
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
						id: 'ItemNumberingConfigurationFk',
						model: 'ItemNumberingConfigurationFk',
						type: FieldType.Quantity,
						label: { text: 'ItemNumberingConfigurationFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ContextFk',
						model: 'ContextFk',
						type: FieldType.Quantity,
						label: { text: 'ContextFk' },
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
