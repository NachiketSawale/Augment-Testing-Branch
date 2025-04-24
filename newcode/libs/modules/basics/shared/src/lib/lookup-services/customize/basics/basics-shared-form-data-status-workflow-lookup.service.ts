/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeFormDataStatusWorkflowEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeFormDataStatusWorkflowEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedFormDataStatusWorkflowLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeFormDataStatusWorkflowEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/formdatastatusworkflow/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'ea76d074c6924d52b1cc88f129016ad1',
			valueMember: 'Id',
			displayMember: 'FormdataStatusruleFk',
			gridConfig: {
				columns: [
					{
						id: 'FormdataStatusruleFk',
						model: 'FormdataStatusruleFk',
						type: FieldType.Quantity,
						label: { text: 'FormdataStatusruleFk' },
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
