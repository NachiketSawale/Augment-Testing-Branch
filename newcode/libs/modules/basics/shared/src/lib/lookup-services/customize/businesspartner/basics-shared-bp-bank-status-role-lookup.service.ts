/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeBpBankStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeBpBankStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedBpBankStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeBpBankStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/bpbankstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '5d6464d64c89459a9464631810e6842b',
			valueMember: 'Id',
			displayMember: 'BankStatusFk',
			gridConfig: {
				columns: [
					{
						id: 'BankStatusFk',
						model: 'BankStatusFk',
						type: FieldType.Quantity,
						label: { text: 'BankStatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'BankStatusTargetFk',
						model: 'BankStatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'BankStatusTargetFk' },
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
