/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { Injectable } from '@angular/core';
import { PpsCommonCalendarSiteEntity } from '../../model/pps-common-calendar-site-entity.class';

@Injectable({
	providedIn: 'root'
})
export class SchedulingLookupCalenderService<IEntity extends object > extends UiCommonLookupEndpointDataService <PpsCommonCalendarSiteEntity, IEntity >{
	public constructor(){
	super({
		httpRead: { route: 'scheduling/calendar/', endPointRead: 'list'},
	}, {
		idProperty: 'Id',
		valueMember: 'Id',
		displayMember: 'Code',
		showGrid: true,
		gridConfig:{
			columns: [
				{
					id: 'Code',
					type: FieldType.Description,
					label: {text: 'Code',key: 'cloud.common.entityCode'},
                    width: 100,
					visible: true,
					readonly: true,
					sortable: true
				},
				{
					id: 'Description',
					type: FieldType.Description,
					label: {text: 'Description',key: 'cloud.common.entityDescription'},
                    width: 150,
					visible: true,
					readonly: true,
					sortable: true
				},
			],
		},
		uuid: 'f7d706d43d2b48c8b0a295695da52850',
	});
}
}

