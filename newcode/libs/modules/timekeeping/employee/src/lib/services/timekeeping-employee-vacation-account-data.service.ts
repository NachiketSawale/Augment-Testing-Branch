/*
 * Copyright(c) RIB Software GmbH
 */
import {  Injectable } from '@angular/core';
import {DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceOptions} from '@libs/platform/data-access';
import { IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { EmployeeComplete, IVacationAccountEntity, IEmployeeEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingEmployeeDataService } from './timekeeping-employee-data.service';

@Injectable({
	providedIn: 'root'
})

export class TimekeepingEmployeeVacationAccountDataService extends DataServiceFlatLeaf<IVacationAccountEntity, IEmployeeEntity, EmployeeComplete> {

	public constructor(timekeepingEmployeeDataService : TimekeepingEmployeeDataService) {
		const options: IDataServiceOptions<IVacationAccountEntity> = {
			apiUrl: 'timekeeping/employee/vacationaccount',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'vacationlistbyparent',
				usePost:true,
				prepareParam: ident => {
					return { PKey1: ident.pKey1 };
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IVacationAccountEntity, IEmployeeEntity, EmployeeComplete>> {
				role: ServiceRole.Leaf,
				itemName: 'VacationAccount',
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

