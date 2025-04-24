/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeLogisticsContextEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeLogisticsContextEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedLogisticsContextLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeLogisticsContextEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/logisticscontext/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'fb80d2d43b854add9a1055b66abe3d0e',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'Code',
						model: 'Code',
						type: FieldType.Code,
						label: { text: 'Code' },
						sortable: true,
						visible: true,
						readonly: true
					},
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
					},
					{
						id: 'UomWeightFk',
						model: 'UomWeightFk',
						type: FieldType.Quantity,
						label: { text: 'UomWeightFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UomVolumeFk',
						model: 'UomVolumeFk',
						type: FieldType.Quantity,
						label: { text: 'UomVolumeFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UomDayFk',
						model: 'UomDayFk',
						type: FieldType.Quantity,
						label: { text: 'UomDayFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UomHourFk',
						model: 'UomHourFk',
						type: FieldType.Quantity,
						label: { text: 'UomHourFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UomMonthFk',
						model: 'UomMonthFk',
						type: FieldType.Quantity,
						label: { text: 'UomMonthFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UomIdleFk',
						model: 'UomIdleFk',
						type: FieldType.Quantity,
						label: { text: 'UomIdleFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
