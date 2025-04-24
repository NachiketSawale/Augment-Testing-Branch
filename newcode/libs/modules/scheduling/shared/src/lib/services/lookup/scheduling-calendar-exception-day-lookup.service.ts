/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';

import { FieldType, ILookupSearchRequest, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { ISchedulingCalendarExceptionDayEntity } from '@libs/scheduling/interfaces';
import { get } from 'lodash';

/**
 * Employee lookup service
 */
@Injectable({
	providedIn: 'root'
})

export class SchedulingCalendarExceptionDayLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<ISchedulingCalendarExceptionDayEntity, TEntity> {

	private calendarFk: number = 1;

	public constructor() {
		super({ httpRead: {route:'scheduling/calendar/exceptionday/',endPointRead:'list'},
				filterParam: true,
				prepareListFilter: () => {
					return 'mainItemId=' + this.calendarFk;
				}},
			{
				uuid: 'f3f58b9e9f0243fe8aeddd21adcfee83',
				idProperty: 'Id',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated',
				gridConfig:{
					columns: [
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
				showGrid: true,
				showDialog: false
			});
	}
	protected override prepareSearchFilter(request: ILookupSearchRequest): string | object | undefined {
		const calendarFk = get(request.additionalParameters, 'CalendarFk');
		this.calendarFk = calendarFk ?? 1;
		return 'mainItemId='+ this.calendarFk;
	}
}