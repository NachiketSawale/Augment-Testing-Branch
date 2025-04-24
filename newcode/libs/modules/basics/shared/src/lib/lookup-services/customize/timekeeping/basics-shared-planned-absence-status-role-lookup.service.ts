/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePlannedAbsenceStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePlannedAbsenceStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPlannedAbsenceStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePlannedAbsenceStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/plannedabsencestatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '3c435d8273be4bd3a25bdb5c5784ba3e',
			valueMember: 'Id',
			displayMember: 'PlannedAbsenceStatusRuleFk',
			gridConfig: {
				columns: [
					{
						id: 'PlannedAbsenceStatusRuleFk',
						model: 'PlannedAbsenceStatusRuleFk',
						type: FieldType.Quantity,
						label: { text: 'PlannedAbsenceStatusRuleFk' },
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
