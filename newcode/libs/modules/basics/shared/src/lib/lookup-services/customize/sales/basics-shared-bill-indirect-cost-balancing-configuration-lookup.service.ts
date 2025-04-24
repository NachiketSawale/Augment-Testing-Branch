/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeBillIndirectCostBalancingConfigurationEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeBillIndirectCostBalancingConfigurationEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedBillIndirectCostBalancingConfigurationLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeBillIndirectCostBalancingConfigurationEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/billindirectcostbalancingconfiguration/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '5173fc90f50240bb8a543fefac9e834e',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeBillIndirectCostBalancingConfigurationEntity) => x.DescriptionInfo),
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
					},
					{
						id: 'IndirectCostBalancingConfigurationDetailFk',
						model: 'IndirectCostBalancingConfigurationDetailFk',
						type: FieldType.Quantity,
						label: { text: 'IndirectCostBalancingConfigurationDetailFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
