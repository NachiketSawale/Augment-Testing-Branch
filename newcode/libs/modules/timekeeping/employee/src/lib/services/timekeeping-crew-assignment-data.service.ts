/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions,
	IDataServiceEndPointOptions,
} from '@libs/platform/data-access';
import { ICrewAssignmentEntity, IEmployeeEntity, EmployeeComplete } from '@libs/timekeeping/interfaces';
import { ServiceRole } from '@libs/platform/data-access';
import { IDataServiceOptions } from '@libs/platform/data-access';
import { TimekeepingEmployeeDataService } from './timekeeping-employee-data.service';

@Injectable({
	providedIn: 'root'
})


export class TimekeepingCrewAssignmentDataService extends DataServiceFlatLeaf<ICrewAssignmentEntity,IEmployeeEntity, EmployeeComplete>{

	public constructor(timekeepingEmployeeDataService : TimekeepingEmployeeDataService) {
		const options: IDataServiceOptions<ICrewAssignmentEntity>  = {
			apiUrl: 'timekeeping/employee/crewassignment',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost:true,
				prepareParam: ident => {
					return { PKey1: ident.pKey1 };
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<ICrewAssignmentEntity,IEmployeeEntity,EmployeeComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'CrewAssignments',
				parent: timekeepingEmployeeDataService,
			},


		};

		super(options);
	}

	public override isParentFn(parentKey: IEmployeeEntity, entity: ICrewAssignmentEntity): boolean {
		return entity.EmployeeFk == parentKey.Id;
	}

}