/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePpsPhaseRequirementStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePpsPhaseRequirementStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPpsPhaseRequirementStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePpsPhaseRequirementStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/ppsphaserequirementstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '6b1ca5b37f534f6e9e16832f8a903136',
			valueMember: 'Id',
			displayMember: 'PhaseReqStatusRuleFk',
			gridConfig: {
				columns: [
					{
						id: 'PhaseReqStatusRuleFk',
						model: 'PhaseReqStatusRuleFk',
						type: FieldType.Quantity,
						label: { text: 'PhaseReqStatusRuleFk' },
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
