/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeEvaluationStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeEvaluationStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedEvaluationStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeEvaluationStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/evaluationstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '1b4d1ed7c950421694110cb70a0f5d3e',
			valueMember: 'Id',
			displayMember: 'EvalstatusruleFk',
			gridConfig: {
				columns: [
					{
						id: 'EvalstatusruleFk',
						model: 'EvalstatusruleFk',
						type: FieldType.Quantity,
						label: { text: 'EvalstatusruleFk' },
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
