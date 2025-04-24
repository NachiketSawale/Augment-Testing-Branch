/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { IEmployeeWTMEntity, EmployeeComplete, IEmployeeEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingEmployeeDataService } from './timekeeping-employee-data.service';


@Injectable({
	providedIn: 'root'
})

export class TimekeepingEmployeeWorkingTimeModelDataService extends DataServiceFlatLeaf<IEmployeeWTMEntity, IEmployeeEntity, EmployeeComplete >{

	public constructor(timekeepingEmployeeDataService:TimekeepingEmployeeDataService) {
		const options: IDataServiceOptions<IEmployeeWTMEntity>  = {
			apiUrl: 'timekeeping/employee/employeewtm',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true,
				prepareParam: ident => {
					return { PKey1: ident.pKey1 };
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IEmployeeWTMEntity, IEmployeeEntity, EmployeeComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'EmployeeWTM',
				parent: timekeepingEmployeeDataService,
			},

		};

		super(options);
	}

	public override isParentFn(parentKey: IEmployeeEntity, entity: IEmployeeWTMEntity): boolean {
		return entity.EmployeeFk == parentKey.Id;
	}
}



