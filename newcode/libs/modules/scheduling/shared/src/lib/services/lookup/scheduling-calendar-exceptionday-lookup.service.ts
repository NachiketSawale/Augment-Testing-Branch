/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { FieldType, ILookupSearchRequest, UiCommonLookupEndpointDataService } from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})
export class SchedulingCalendarExceptionDayLookup<TEntity extends object = object> extends UiCommonLookupEndpointDataService<TEntity> {
	public constructor() {
		super({
			httpRead: { route: 'scheduling/calendar/exceptionday/', endPointRead: 'list',usePostForRead:false },
			filterParam: true
		}, {
			uuid: 'f3f58b9e9f0243fe8aeddd21adcfee83',
			valueMember: 'Id',
			displayMember: 'Description',
			gridConfig: {
				columns: [
					{
						id: 'Description',
						model: 'Description',
						type: FieldType.Translation,
						label: { text: 'Id', key: 'cloud.common.entityDescription' },
						sortable: true,
						visible: true
					}
				]
			}
		});
	}

	protected override prepareSearchFilter(request: ILookupSearchRequest): string | object | undefined {
		//const filterValue = get(request.additionalParameters, 'filterValue');
		return  'mainItemId=0';
	}
}