/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeProjectChangeStatusWorkflowEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeProjectChangeStatusWorkflowEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedProjectChangeStatusWorkflowLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeProjectChangeStatusWorkflowEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/projectchangestatusworkflow/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '885a3fd7be8941d0b7db2cc8d0acb6dc',
			valueMember: 'Id',
			displayMember: 'ChangestatusruleFk',
			gridConfig: {
				columns: [
					{
						id: 'ChangestatusruleFk',
						model: 'ChangestatusruleFk',
						type: FieldType.Quantity,
						label: { text: 'ChangestatusruleFk' },
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
