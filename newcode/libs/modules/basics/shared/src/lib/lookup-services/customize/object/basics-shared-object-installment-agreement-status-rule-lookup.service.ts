/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeObjectInstallmentAgreementStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeObjectInstallmentAgreementStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedObjectInstallmentAgreementStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeObjectInstallmentAgreementStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/objectinstallmentagreementstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '81b2ef3aa2164f919684aadededeb8ed',
			valueMember: 'Id',
			displayMember: 'InstallmentAgreementStateFk',
			gridConfig: {
				columns: [
					{
						id: 'InstallmentAgreementStateFk',
						model: 'InstallmentAgreementStateFk',
						type: FieldType.Quantity,
						label: { text: 'InstallmentAgreementStateFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'InstallmentAgreementStateTargetFk',
						model: 'InstallmentAgreementStateTargetFk',
						type: FieldType.Quantity,
						label: { text: 'InstallmentAgreementStateTargetFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'CommentText',
						model: 'CommentText',
						type: FieldType.Comment,
						label: { text: 'CommentText' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'AccessrightDescriptorFk',
						model: 'AccessrightDescriptorFk',
						type: FieldType.Quantity,
						label: { text: 'AccessrightDescriptorFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'HasRoleValidation',
						model: 'HasRoleValidation',
						type: FieldType.Boolean,
						label: { text: 'HasRoleValidation' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
