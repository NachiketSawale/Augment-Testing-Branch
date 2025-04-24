/*
 * Copyright(c) RIB Software GmbH
 */


import { IEmployeeDocumentEntity, IEmployeeEntity, EmployeeComplete } from '@libs/timekeeping/interfaces';
import { TimekeepingEmployeeDataService } from './timekeeping-employee-data.service';
import { DocumentDataLeafService } from '@libs/documents/shared';
import { IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})

export class TimekeepingEmployeeDocumentDataService extends DocumentDataLeafService<IEmployeeDocumentEntity, IEmployeeEntity, EmployeeComplete> {
	public constructor(timekeepingEmployeeDataService: TimekeepingEmployeeDataService) {
		const options: IDataServiceOptions<IEmployeeDocumentEntity> = {
			apiUrl: 'timekeeping/employees/document',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true,
				prepareParam: ident => {
					return { PKey1:  ident.pKey1 };
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IEmployeeDocumentEntity, IEmployeeEntity, EmployeeComplete>> {
				role: ServiceRole.Leaf,
				itemName: 'Documents',
				parent: timekeepingEmployeeDataService
			}
		};

		super(options);
	}

	public override isParentFn(parentKey: IEmployeeEntity, entity: IEmployeeDocumentEntity): boolean {
		return entity.EmployeeFk == parentKey.Id;
	}
}