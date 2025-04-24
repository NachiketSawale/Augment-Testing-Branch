/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { FieldType, ILookupSearchRequest, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { ISchedulingCalendarWeekDayEntity } from '@libs/scheduling/interfaces';
import { get } from 'lodash';
@Injectable({
	providedIn: 'root'
})
export class SchedulingCalendarWeekdayLookup<TEntity extends object = object> extends UiCommonLookupEndpointDataService<ISchedulingCalendarWeekDayEntity, TEntity> {

	private calendarFk: number = 0;

	public constructor() {
		super({
			httpRead: { route: 'scheduling/calendar/weekday/', endPointRead: 'list' },
			filterParam: true,
			prepareListFilter: () => {
				return 'mainItemId=' + this.calendarFk;
			}},
			{
			uuid: 'f3f58b9e9f0243fe8aeddd21adcfee83',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'AcronymInfo',
			gridConfig: {
				columns: [
					{
						id: 'Acronym',
						model: 'AcronymInfo',
						type: FieldType.Translation,
						label: { text: 'Acronym', key: 'scheduling.calendar.entityAcronym' },
						sortable: true,
						visible: true
					},
					{
						id: 'Description',
						model: 'DescriptionInfo',
						type: FieldType.Translation,
						label: {text: 'Description', key: 'cloud.common.entityDescription'},
						sortable: true,
						visible: true
					}
				]
			}
		});
	}
	protected override prepareSearchFilter(request: ILookupSearchRequest): string | object | undefined {
		const calendarFk = get(request.additionalParameters, 'CalendarFk');
		this.calendarFk = calendarFk ?? 0;
		return 'mainItemId='+ this.calendarFk;
	}
}