/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import { createLookup, FieldType, ILookupSearchRequest, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { SchedulingCalendarLookup } from '@libs/scheduling/shared';


/**
 * Employee lookup service
 */
@Injectable({
	providedIn: 'root'
})

export class TimekeepingShiftLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<TEntity> {

	public constructor() {
		super({ httpRead: {route:'timekeeping/shiftmodel/',endPointRead:'listbyemployeeortkgroup'},
				  filterParam: true,
				  prepareListFilter: context => {
						return {
							PKey1: null,
							PKey2:1,
							PKey3:6  // could be from entity context
						};
		        }
				},
			{
				uuid: 'd040410fc40f40569af16694ffc882af',
				idProperty: 'Id',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo',
				gridConfig:{
					columns: [
						{
							id: 'descriptionInfo',
							model: 'DescriptionInfo',
							type: FieldType.Translation,
							label: {text: 'Description',key:'cloud.common.entityDescription'},
							sortable: true,
							visible: true
						},
						{
							id: 'Calendar',
							model: 'CalendarFk',
							type: FieldType.Lookup,
							lookupOptions: createLookup({
								dataServiceToken: SchedulingCalendarLookup
							}),
							label: {text: 'Calendar'},
							sortable: true,
							visible: true,
							readonly: true,
							width: 100
						}
					]
				},
				showGrid:true,
				showDialog: false,

			});


	}


	protected override prepareSearchFilter(request: ILookupSearchRequest): string | object | undefined {
		//const filterValue = get(request.additionalParameters, 'filterValue');

		return {
			PKey1: null,
			PKey2: 1,
			PKey3: 6
		};
	}

}