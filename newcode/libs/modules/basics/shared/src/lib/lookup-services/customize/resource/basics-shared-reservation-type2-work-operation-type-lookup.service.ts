/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeReservationType2WorkOperationTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeReservationType2WorkOperationTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedReservationType2WorkOperationTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeReservationType2WorkOperationTypeEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/reservationtype2workoperationtype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '3832c26e4dc94b92b5aa8713c63258f0',
			valueMember: 'Id',
			displayMember: 'ReservationTypeFk',
			gridConfig: {
				columns: [
					{
						id: 'ReservationTypeFk',
						model: 'ReservationTypeFk',
						type: FieldType.Quantity,
						label: { text: 'ReservationTypeFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'EtmContextFk',
						model: 'EtmContextFk',
						type: FieldType.Quantity,
						label: { text: 'EtmContextFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'WorkOperationTypeFk',
						model: 'WorkOperationTypeFk',
						type: FieldType.Quantity,
						label: { text: 'WorkOperationTypeFk' },
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
					}
				]
			}
		});
	}
}
