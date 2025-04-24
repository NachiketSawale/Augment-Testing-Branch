/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeObjectInstallmentAgreementStatusWorkflowEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeObjectInstallmentAgreementStatusWorkflowEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedObjectInstallmentAgreementStatusWorkflowLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeObjectInstallmentAgreementStatusWorkflowEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/objectinstallmentagreementstatusworkflow/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '658e8f76582c48cfa9b58b4f9b63452a',
			valueMember: 'Id',
			displayMember: 'InstallmentAgreementStateRuleFk',
			gridConfig: {
				columns: [
					{
						id: 'InstallmentAgreementStateRuleFk',
						model: 'InstallmentAgreementStateRuleFk',
						type: FieldType.Quantity,
						label: { text: 'InstallmentAgreementStateRuleFk' },
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
