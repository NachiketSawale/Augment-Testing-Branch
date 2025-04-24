/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class ProductionplanningChildrenLookupService<IEntity extends object > extends UiCommonLookupEndpointDataService < IEntity >{
	public constructor(){
	super({httpRead: { route: 'productionplanning/productionplace/', endPointRead: 'mobilelist' }}, {
		idProperty: 'Id',
		valueMember: 'Description',
		displayMember: 'Description',
		showGrid: true,
		gridConfig:{
			columns: [
                {
					id: 'Code',
					type: FieldType.Description,
					label: {text: 'Code',key: 'cloud.common.entityCode'},
					visible: true,
					readonly: true,
					sortable: true
				},
				{
					id: 'Description',
					type: FieldType.Description,
					label: {text: 'Description',key: 'cloud.common.entityDescription'},
					visible: true,
					readonly: true,
					sortable: true
				},
			]
		},
		uuid: '06afd4091dbd4911887189028da82018',
	});
}
}

