/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import {ISchedulingCalendarEntity} from '@libs/scheduling/interfaces';

/**
 * Employee lookup service
 */
@Injectable({
	providedIn: 'root'
})

export class SchedulingCalendarLookup<TEntity extends object> extends UiCommonLookupEndpointDataService<ISchedulingCalendarEntity, TEntity> {

	public constructor() {
		super({ httpRead: {route:'scheduling/calendar/',endPointRead:'list'}},
			{
				uuid: 'f7d706d43d2b48c8b0a295695da52850',
				idProperty: 'Id',
				valueMember: 'Id',
				displayMember: 'Code',
				gridConfig:{
					columns: [
						{
							id: 'code',
							model: 'Code',
							type: FieldType.Code,
							label: {text: 'Calendar',key:'cloud.common.entityCode'},
							sortable: true,
							visible: true,
							readonly: true,
							width: 100
						},
						{
							id: 'descriptionInfo',
							model: 'DescriptionInfo.Translated',
							type: FieldType.Translation,
							label: {text: 'Description',key:'cloud.common.entityDescription'},
							sortable: true,
							visible: true,
							width: 200
						}
					]
				},
				showGrid:true,
				showDialog: false,
			});
	}
}