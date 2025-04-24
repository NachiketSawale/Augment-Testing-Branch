/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeLogisticsSettlementRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeLogisticsSettlementRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedLogisticsSettlementRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeLogisticsSettlementRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/logisticssettlementrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'de5be3e724b44c78af3feb313e33d78c',
			valueMember: 'Id',
			displayMember: 'SettlementstatusruleFk',
			gridConfig: {
				columns: [
					{
						id: 'SettlementstatusruleFk',
						model: 'SettlementstatusruleFk',
						type: FieldType.Quantity,
						label: { text: 'SettlementstatusruleFk' },
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
