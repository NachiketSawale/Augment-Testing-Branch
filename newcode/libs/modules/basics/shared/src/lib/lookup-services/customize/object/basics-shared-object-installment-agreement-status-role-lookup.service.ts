/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeObjectInstallmentAgreementStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeObjectInstallmentAgreementStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedObjectInstallmentAgreementStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeObjectInstallmentAgreementStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/objectinstallmentagreementstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '3e45167df9ad45379ee58c243d388a2c',
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
						id: 'ClerkRoleFk',
						model: 'ClerkRoleFk',
						type: FieldType.Quantity,
						label: { text: 'ClerkRoleFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
