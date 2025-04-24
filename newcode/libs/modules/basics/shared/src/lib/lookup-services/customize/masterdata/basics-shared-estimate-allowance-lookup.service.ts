/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeEstimateAllowanceEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeEstimateAllowanceEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedEstimateAllowanceLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeEstimateAllowanceEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/estimateallowance/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '3f631b6516b246ad876531553ea2499a',
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
						id: 'MasterContextFk',
						model: 'MasterContextFk',
						type: FieldType.Quantity,
						label: { text: 'MasterContextFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'AllowanceTypeFk',
						model: 'AllowanceTypeFk',
						type: FieldType.Quantity,
						label: { text: 'AllowanceTypeFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'MarkupCalcTypeFk',
						model: 'MarkupCalcTypeFk',
						type: FieldType.Quantity,
						label: { text: 'MarkupCalcTypeFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsOneStep',
						model: 'IsOneStep',
						type: FieldType.Boolean,
						label: { text: 'IsOneStep' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsBalanceFP',
						model: 'IsBalanceFP',
						type: FieldType.Boolean,
						label: { text: 'IsBalanceFP' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'QuantityTypeFk',
						model: 'QuantityTypeFk',
						type: FieldType.Quantity,
						label: { text: 'QuantityTypeFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'MarkupGa',
						model: 'MarkupGa',
						type: FieldType.Quantity,
						label: { text: 'MarkupGa' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'MarkupRp',
						model: 'MarkupRp',
						type: FieldType.Quantity,
						label: { text: 'MarkupRp' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'MarkupAm',
						model: 'MarkupAm',
						type: FieldType.Quantity,
						label: { text: 'MarkupAm' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'MarkupGaSc',
						model: 'MarkupGaSc',
						type: FieldType.Quantity,
						label: { text: 'MarkupGaSc' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'MarkupRpSc',
						model: 'MarkupRpSc',
						type: FieldType.Quantity,
						label: { text: 'MarkupRpSc' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'MarkupAmSc',
						model: 'MarkupAmSc',
						type: FieldType.Quantity,
						label: { text: 'MarkupAmSc' },
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
						id: 'AllAreaGroupTypeFk',
						model: 'AllAreaGroupTypeFk',
						type: FieldType.Quantity,
						label: { text: 'AllAreaGroupTypeFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
