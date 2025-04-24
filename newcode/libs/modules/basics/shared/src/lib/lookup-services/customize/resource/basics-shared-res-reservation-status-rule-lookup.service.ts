/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeResReservationStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeResReservationStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedResReservationStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeResReservationStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/resreservationstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '6721ecef88f04e9f98fe233a278e4464',
			valueMember: 'Id',
			displayMember: 'ReservationstatFk',
			gridConfig: {
				columns: [
					{
						id: 'ReservationstatFk',
						model: 'ReservationstatFk',
						type: FieldType.Quantity,
						label: { text: 'ReservationstatFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ReservationstatTargetFk',
						model: 'ReservationstatTargetFk',
						type: FieldType.Quantity,
						label: { text: 'ReservationstatTargetFk' },
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
