/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeLogisticsClaimMethodEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeLogisticsClaimMethodEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedLogisticsClaimMethodLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeLogisticsClaimMethodEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/logisticsclaimmethod/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '5b4612d8e1f5400c8c6ddcbfa2459f59',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeLogisticsClaimMethodEntity) => x.DescriptionInfo),
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
						id: 'InstructionInfo',
						model: 'InstructionInfo',
						type: FieldType.Translation,
						label: { text: 'InstructionInfo' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'WizardDescriptionInfo',
						model: 'WizardDescriptionInfo',
						type: FieldType.Translation,
						label: { text: 'WizardDescriptionInfo' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
