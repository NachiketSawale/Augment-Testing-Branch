/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeBpStatus2WorkflowEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeBpStatus2WorkflowEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedBpStatus2WorkflowLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeBpStatus2WorkflowEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/bpstatus2workflow/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '477832b7c5df4d1ba5c020819813743e',
			valueMember: 'Id',
			displayMember: 'TemplateFk',
			gridConfig: {
				columns: [
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
					},
					{
						id: 'Status2ruleFk',
						model: 'Status2ruleFk',
						type: FieldType.Quantity,
						label: { text: 'Status2ruleFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
