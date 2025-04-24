/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable} from '@angular/core';
import { DataServiceFlatNode, IDataServiceChildRoleOptions, IDataServiceOptions } from '@libs/platform/data-access';
import { TimekeepingEmployeeDataService } from './timekeeping-employee-data.service';
import { IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { IEmployeeDefaultEntity, IEmployeeEntity, EmployeeComplete, EmployeeDefaultComplete } from '@libs/timekeeping/interfaces';

@Injectable({
	providedIn: 'root'
})

export class TimekeepingEmployeeDefaultDataService extends DataServiceFlatNode<IEmployeeDefaultEntity, EmployeeDefaultComplete, IEmployeeEntity, EmployeeComplete> {
	public constructor(timekeepingEmployeeDataService : TimekeepingEmployeeDataService) {
		const options: IDataServiceOptions<IEmployeeDefaultEntity> = {
			apiUrl: 'timekeeping/employee/default',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost:true,
				prepareParam: ident => {
					return { PKey1:  ident.pKey1 };
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IEmployeeDefaultEntity, IEmployeeEntity, EmployeeComplete>> {
				role: ServiceRole.Node,
				itemName: 'Defaults',
				parent: timekeepingEmployeeDataService
			}
		};

		super(options);
	}

	protected override onLoadSucceeded(loaded: {dtos: IEmployeeDefaultEntity[]}): IEmployeeDefaultEntity[] {
		return loaded.dtos;
	}
}
