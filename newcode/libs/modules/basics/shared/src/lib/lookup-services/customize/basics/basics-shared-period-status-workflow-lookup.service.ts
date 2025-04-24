/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePeriodStatusWorkflowEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePeriodStatusWorkflowEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPeriodStatusWorkflowLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePeriodStatusWorkflowEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/periodstatusworkflow/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'bbcb7c9ca4674caeb7cfe7fa68b5fdd0',
			valueMember: 'Id',
			displayMember: 'PeriodStatusruleFk',
			gridConfig: {
				columns: [
					{
						id: 'PeriodStatusruleFk',
						model: 'PeriodStatusruleFk',
						type: FieldType.Quantity,
						label: { text: 'PeriodStatusruleFk' },
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
					},
					{
						id: 'ClerkFk',
						model: 'ClerkFk',
						type: FieldType.Quantity,
						label: { text: 'ClerkFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
