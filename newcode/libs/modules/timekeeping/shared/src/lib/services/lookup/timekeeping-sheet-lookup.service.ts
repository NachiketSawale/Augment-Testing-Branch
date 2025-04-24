/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { createLookup, FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { ISheetEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingEmployeeLookupService } from '../lookup/timekeeping-employee-lookup.service';

@Injectable({
	providedIn: 'root',
})
export class TimekeepingSheetLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<ISheetEntity, T> {

	public constructor() {
		super(
			{
				httpRead: { route: 'timekeeping/recording/sheet/', endPointRead: 'listbyparent', usePostForRead: true },
				filterParam: true,
				prepareListFilter: () => {
					return {PKey1:this.filter()};
				},
			},
			{
				uuid: '8540db15475c4dc0ae19783686141508',
				valueMember: 'Id',
				displayMember: 'EmployeeDescription',
				gridConfig: {
					columns: [
						{
							id: 'Comment',
							model: 'CommentText',
							type: FieldType.Description,
							label: { text: 'CommentText', key: 'cloud.common.entityComment' },
							sortable: true
						},
						{
							id: 'Employee',
							model: 'EmployeeFk',
							type: FieldType.Lookup,
							lookupOptions: createLookup({
								dataServiceToken: TimekeepingEmployeeLookupService,
								displayMember: 'Code'
							}),
							label: { text: 'Employee', key: 'timekeeping.common.employee' },
							sortable: true
						},
						{
							id: 'Employee-Description',
							model: 'EmployeeDescription',
							type: FieldType.Translation,
							label: { text: 'EmployeeDescription', key: 'timekeeping.common.employeeDescription' },
							sortable: true
						},
					],
				},
			},
		);
	}

	private filter() {
		let moduleId = 0;
		this.getList().subscribe(list => {
			if (list && list.length > 0) {
				moduleId = list[0].RecordingFk as number;
			}
		});
		return moduleId;
	}
}