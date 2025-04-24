/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeBpSupplierStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeBpSupplierStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedBpSupplierStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeBpSupplierStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/bpsupplierstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '1388194e6bca459ba35da77e51474356',
			valueMember: 'Id',
			displayMember: 'SupplierstatusFk',
			gridConfig: {
				columns: [
					{
						id: 'SupplierstatusFk',
						model: 'SupplierstatusFk',
						type: FieldType.Quantity,
						label: { text: 'SupplierstatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'SupplierstatusTargetFk',
						model: 'SupplierstatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'SupplierstatusTargetFk' },
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
						id: 'Hasrolevalidation',
						model: 'Hasrolevalidation',
						type: FieldType.Boolean,
						label: { text: 'Hasrolevalidation' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
