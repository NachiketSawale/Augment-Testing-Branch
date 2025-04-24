/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeSCurveDetailEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeSCurveDetailEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedSCurveDetailLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeSCurveDetailEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/scurvedetail/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '0853e9a36bf14b45b12929c8d06cdd1d',
			valueMember: 'Id',
			displayMember: 'ScurveFk',
			gridConfig: {
				columns: [
					{
						id: 'ScurveFk',
						model: 'ScurveFk',
						type: FieldType.Quantity,
						label: { text: 'ScurveFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Percentoftime',
						model: 'Percentoftime',
						type: FieldType.Quantity,
						label: { text: 'Percentoftime' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Percentofcost',
						model: 'Percentofcost',
						type: FieldType.Quantity,
						label: { text: 'Percentofcost' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Comment',
						model: 'Comment',
						type: FieldType.Comment,
						label: { text: 'Comment' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Bin',
						model: 'Bin',
						type: FieldType.Quantity,
						label: { text: 'Bin' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Weight',
						model: 'Weight',
						type: FieldType.Quantity,
						label: { text: 'Weight' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
