/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeDashboardGroupEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeDashboardGroupEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedDashboardGroupLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeDashboardGroupEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/dashboardgroup/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'eab8055548d542149c649ea0348507f3',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeDashboardGroupEntity) => x.DescriptionInfo),
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
						id: 'AccessrightDescriptorFk',
						model: 'AccessrightDescriptorFk',
						type: FieldType.Quantity,
						label: { text: 'AccessrightDescriptorFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Icon',
						model: 'Icon',
						type: FieldType.Quantity,
						label: { text: 'Icon' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsVisible',
						model: 'IsVisible',
						type: FieldType.Boolean,
						label: { text: 'IsVisible' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Visibility',
						model: 'Visibility',
						type: FieldType.Quantity,
						label: { text: 'Visibility' },
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
						id: 'NameInfo',
						model: 'NameInfo',
						type: FieldType.Translation,
						label: { text: 'NameInfo' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
