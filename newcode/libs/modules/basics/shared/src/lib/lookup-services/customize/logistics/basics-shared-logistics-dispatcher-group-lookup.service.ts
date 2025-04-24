/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeLogisticsDispatcherGroupEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeLogisticsDispatcherGroupEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedLogisticsDispatcherGroupLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeLogisticsDispatcherGroupEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/logisticsdispatchergroup/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'ff7ef28178264662aef3d3713588616b',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeLogisticsDispatcherGroupEntity) => x.DescriptionInfo),
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
					},
					{
						id: 'CalendarFk',
						model: 'CalendarFk',
						type: FieldType.Quantity,
						label: { text: 'CalendarFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ResourceContextFk',
						model: 'ResourceContextFk',
						type: FieldType.Quantity,
						label: { text: 'ResourceContextFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
