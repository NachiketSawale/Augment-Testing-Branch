/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeChartPresentationEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeChartPresentationEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedChartPresentationLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeChartPresentationEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/chartpresentation/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '345db6df8bb74cc696c3e290b6dcfb1b',
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
						id: 'Color',
						model: 'Color',
						type: FieldType.Quantity,
						label: { text: 'Color' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Font',
						model: 'Font',
						type: FieldType.Quantity,
						label: { text: 'Font' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Fontcolor',
						model: 'Fontcolor',
						type: FieldType.Quantity,
						label: { text: 'Fontcolor' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Fontsize',
						model: 'Fontsize',
						type: FieldType.Quantity,
						label: { text: 'Fontsize' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
