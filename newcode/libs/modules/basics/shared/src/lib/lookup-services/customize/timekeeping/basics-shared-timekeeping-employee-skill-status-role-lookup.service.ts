/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTimekeepingEmployeeSkillStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTimekeepingEmployeeSkillStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTimekeepingEmployeeSkillStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTimekeepingEmployeeSkillStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/timekeepingemployeeskillstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '115a4d97fc0648d5b255debae9198474',
			valueMember: 'Id',
			displayMember: 'EmployeeSkillStatusRuleFk',
			gridConfig: {
				columns: [
					{
						id: 'EmployeeSkillStatusRuleFk',
						model: 'EmployeeSkillStatusRuleFk',
						type: FieldType.Quantity,
						label: { text: 'EmployeeSkillStatusRuleFk' },
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
