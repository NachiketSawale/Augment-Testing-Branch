/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePpsProductionSetWorkflowEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePpsProductionSetWorkflowEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPpsProductionSetWorkflowLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePpsProductionSetWorkflowEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/ppsproductionsetworkflow/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '471fe9a3bea94d66903405157acc8faa',
			valueMember: 'Id',
			displayMember: 'ProductionSetStatusRuleFk',
			gridConfig: {
				columns: [
					{
						id: 'ProductionSetStatusRuleFk',
						model: 'ProductionSetStatusRuleFk',
						type: FieldType.Quantity,
						label: { text: 'ProductionSetStatusRuleFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ClerkFk',
						model: 'ClerkFk',
						type: FieldType.Quantity,
						label: { text: 'ClerkFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'TemplateFk',
						model: 'TemplateFk',
						type: FieldType.Quantity,
						label: { text: 'TemplateFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsBeforeStatus',
						model: 'IsBeforeStatus',
						type: FieldType.Boolean,
						label: { text: 'IsBeforeStatus' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsMandatory',
						model: 'IsMandatory',
						type: FieldType.Boolean,
						label: { text: 'IsMandatory' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
