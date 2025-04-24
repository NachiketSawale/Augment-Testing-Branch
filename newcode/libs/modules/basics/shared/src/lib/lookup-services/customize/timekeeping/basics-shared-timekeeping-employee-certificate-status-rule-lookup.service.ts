/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTimekeepingEmployeeCertificateStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTimekeepingEmployeeCertificateStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTimekeepingEmployeeCertificateStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTimekeepingEmployeeCertificateStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/timekeepingemployeecertificatestatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '2f365c57af924e4a9572f2254f61dc0f',
			valueMember: 'Id',
			displayMember: 'EmployeeCertificateStatusRuleFk',
			gridConfig: {
				columns: [
					{
						id: 'EmployeeCertificateStatusRuleFk',
						model: 'EmployeeCertificateStatusRuleFk',
						type: FieldType.Quantity,
						label: { text: 'EmployeeCertificateStatusRuleFk' },
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
