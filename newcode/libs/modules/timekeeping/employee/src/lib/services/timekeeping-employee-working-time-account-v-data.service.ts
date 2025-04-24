/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import {DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceOptions} from '@libs/platform/data-access';
import { TimekeepingEmployeeDataService } from './timekeeping-employee-data.service';
import { IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { IWorkingTimeAccountVEntity, EmployeeComplete, IEmployeeEntity } from '@libs/timekeeping/interfaces';

@Injectable({
	providedIn: 'root'
})
export class TimekeepingEmployeeWorkingTimeAccountVDataService extends DataServiceFlatLeaf<IWorkingTimeAccountVEntity, IEmployeeEntity, EmployeeComplete> {

	public constructor(timekeepingEmployeeDataService : TimekeepingEmployeeDataService){
			const options: IDataServiceOptions<IWorkingTimeAccountVEntity> = {
				apiUrl: 'timekeeping/employee/workingtimeaccount_v',
				readInfo: <IDataServiceEndPointOptions>{
					endPoint: 'listByParent',
					usePost: true,
					prepareParam: ident => {
						return { PKey1: ident.pKey1 };
					}
				},
				roleInfo: <IDataServiceChildRoleOptions<IWorkingTimeAccountVEntity, IEmployeeEntity, EmployeeComplete>>{
					role: ServiceRole.Leaf,
					itemName: 'WorkingTimeAccountV',
					parent: timekeepingEmployeeDataService
				},
				entityActions: {
					createSupported: false,
					deleteSupported: false
				}
			};

			super(options);
	}
}
