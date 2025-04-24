/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IEmployeeEntity } from '@libs/timekeeping/interfaces';

/**
 * Employee lookup service
 */
@Injectable({
    providedIn: 'root'
})

export class TimekeepingEmployeeLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IEmployeeEntity, TEntity> {

    public constructor() {
	    super({httpRead: {route:'timekeeping/employee/',endPointRead:'lookup'}},
	    {
		    uuid: 'd040410fc40f40569af16694ffc882af',
		    idProperty: 'Id',
		    valueMember: 'Id',
		    displayMember: 'Code',
		    gridConfig:{
			    uuid: 'd040410fc40f40569af16694ffc882af',
			    columns: [
				    {
					    id: 'code',
					    model: 'Code',
					    type: FieldType.Code,
					    label: {text: 'Code'},
					    sortable: true,
					    visible: true,
					    readonly: true,
					    width: 100
				    },
				    {
					    id: 'desc',
					    model: 'DescriptionInfo',
					    type: FieldType.Translation,
					    label: {text: 'Description'},
					    sortable: true,
					    visible: true,
					    readonly: true,
					    width: 200
				    }
			    ]
		    },
		    showGrid:true,
		    showDialog: false,

	    });


        }

}