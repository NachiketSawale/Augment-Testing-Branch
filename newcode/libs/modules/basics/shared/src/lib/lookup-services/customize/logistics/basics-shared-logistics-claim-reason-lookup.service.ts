/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeLogisticsClaimReasonEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeLogisticsClaimReasonEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedLogisticsClaimReasonLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeLogisticsClaimReasonEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/logisticsclaimreason/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '650885d1a426459fa28e4293281c8c58',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeLogisticsClaimReasonEntity) => x.DescriptionInfo),
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
						id: 'DateRequested',
						model: 'DateRequested',
						type: FieldType.Boolean,
						label: { text: 'DateRequested' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'QuantityRequested',
						model: 'QuantityRequested',
						type: FieldType.Boolean,
						label: { text: 'QuantityRequested' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'WotRequested',
						model: 'WotRequested',
						type: FieldType.Boolean,
						label: { text: 'WotRequested' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UomRequested',
						model: 'UomRequested',
						type: FieldType.Boolean,
						label: { text: 'UomRequested' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Description2Info',
						model: 'Description2Info',
						type: FieldType.Translation,
						label: { text: 'Description2Info' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
