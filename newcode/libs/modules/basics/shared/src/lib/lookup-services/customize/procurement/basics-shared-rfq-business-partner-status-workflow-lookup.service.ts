/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeRfqBusinessPartnerStatusWorkflowEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeRfqBusinessPartnerStatusWorkflowEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedRfqBusinessPartnerStatusWorkflowLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeRfqBusinessPartnerStatusWorkflowEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/rfqbusinesspartnerstatusworkflow/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'bf7e5c535f034c099479de6c5e54f491',
			valueMember: 'Id',
			displayMember: 'BpStatusRuleFk',
			gridConfig: {
				columns: [
					{
						id: 'BpStatusRuleFk',
						model: 'BpStatusRuleFk',
						type: FieldType.Quantity,
						label: { text: 'BpStatusRuleFk' },
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
