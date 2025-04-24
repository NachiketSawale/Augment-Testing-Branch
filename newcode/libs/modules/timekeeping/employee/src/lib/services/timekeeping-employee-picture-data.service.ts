/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { IEmployeePictureEntity, IEmployeeEntity, EmployeeComplete } from '@libs/timekeeping/interfaces';
import { TimekeepingEmployeeDataService } from './timekeeping-employee-data.service';

@Injectable({
	providedIn: 'root'
})

export class TimekeepingEmployeePictureDataService extends DataServiceFlatLeaf<IEmployeePictureEntity, IEmployeeEntity, EmployeeComplete> {

	public constructor(timekeepingEmployeeDataService : TimekeepingEmployeeDataService) {
		const options: IDataServiceOptions<IEmployeePictureEntity> = {
			apiUrl: 'timekeeping/employee/picture',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint:'listbyparent',
				usePost: true,
				prepareParam: ident => {
					return { PKey1: ident.pKey1 };
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IEmployeePictureEntity, IEmployeeEntity, EmployeeComplete>> {
				role: ServiceRole.Leaf,
				itemName: 'EmployeePictures',
				parent: timekeepingEmployeeDataService
			}
		};

		super(options);
	}

	public override isParentFn(parentKey: IEmployeeEntity, entity: IEmployeePictureEntity): boolean {
		return entity.EmployeeFk === parentKey.Id;
	}


}
