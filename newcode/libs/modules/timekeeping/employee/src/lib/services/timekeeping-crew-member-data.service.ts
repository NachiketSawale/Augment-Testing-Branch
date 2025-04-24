/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable} from '@angular/core';
import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions,
	IDataServiceEndPointOptions,
} from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { IDataServiceOptions } from '@libs/platform/data-access';
import { TimekeepingEmployeeDataService } from './timekeeping-employee-data.service';
import { ICrewMemberEntity, IEmployeeEntity, EmployeeComplete } from '@libs/timekeeping/interfaces';


@Injectable({
	providedIn: 'root'
})
export class TimekeepingCrewMemberDataService extends DataServiceFlatLeaf<ICrewMemberEntity, IEmployeeEntity, EmployeeComplete> {
	public constructor(timekeepingEmployeeDataService : TimekeepingEmployeeDataService) {
		const options: IDataServiceOptions<ICrewMemberEntity> = {
			apiUrl: 'timekeeping/employee/crewmember',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost:true,
				prepareParam: ident => {
					return { PKey1: ident.pKey1 };
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<ICrewMemberEntity, IEmployeeEntity, EmployeeComplete>> {
				role: ServiceRole.Leaf,
				itemName: 'CrewMember',
				parent: timekeepingEmployeeDataService
			},
			entityActions:{
				createSupported: false,
				deleteSupported: false
			}
		};

		super(options);
	}

	public override isParentFn(parentKey: IEmployeeEntity, entity: ICrewMemberEntity): boolean {
		return entity.EmployeeCrewFk == parentKey.Id;
	}
}
