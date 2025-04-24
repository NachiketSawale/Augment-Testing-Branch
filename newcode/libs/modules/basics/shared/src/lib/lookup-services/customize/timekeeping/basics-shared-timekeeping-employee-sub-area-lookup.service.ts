/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTimekeepingEmployeeSubAreaEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTimekeepingEmployeeSubAreaEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTimekeepingEmployeeSubAreaLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTimekeepingEmployeeSubAreaEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/timekeepingemployeesubarea/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '1bfc06bcaba54f9c899e819422bc75a9',
			valueMember: 'Id',
			displayMember: 'Description',
			gridConfig: {
				columns: [
					{
						id: 'Description',
						model: 'Description',
						type: FieldType.Description,
						label: { text: 'Description' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'TimesheetContextFk',
						model: 'TimesheetContextFk',
						type: FieldType.Quantity,
						label: { text: 'TimesheetContextFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'EmployeeAreaFk',
						model: 'EmployeeAreaFk',
						type: FieldType.Quantity,
						label: { text: 'EmployeeAreaFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsDefault',
						model: 'IsDefault',
						type: FieldType.Boolean,
						label: { text: 'IsDefault' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
