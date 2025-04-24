/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeBpBankStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeBpBankStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedBpBankStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeBpBankStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/bpbankstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '3263bb723de649dbb01bccd1e2252356',
			valueMember: 'Id',
			displayMember: 'BankStatusRuleFk',
			gridConfig: {
				columns: [
					{
						id: 'BankStatusRuleFk',
						model: 'BankStatusRuleFk',
						type: FieldType.Quantity,
						label: { text: 'BankStatusRuleFk' },
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
