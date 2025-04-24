/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeChartPrintEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeChartPrintEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedChartPrintLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeChartPrintEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/chartprint/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '7cab351d6bb542138a9eb5b13bf8dcb5',
			valueMember: 'Id',
			displayMember: 'Name',
			gridConfig: {
				columns: [
					{
						id: 'NameInfo',
						model: 'NameInfo',
						type: FieldType.Translation,
						label: { text: 'NameInfo' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'PapersizeFk',
						model: 'PapersizeFk',
						type: FieldType.Quantity,
						label: { text: 'PapersizeFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Height',
						model: 'Height',
						type: FieldType.Quantity,
						label: { text: 'Height' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isorientationlandscape',
						model: 'Isorientationlandscape',
						type: FieldType.Boolean,
						label: { text: 'Isorientationlandscape' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isheader',
						model: 'Isheader',
						type: FieldType.Boolean,
						label: { text: 'Isheader' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ReportFk',
						model: 'ReportFk',
						type: FieldType.Quantity,
						label: { text: 'ReportFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
