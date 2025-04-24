/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable} from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceOptions } from '@libs/platform/data-access';
import { ICertifiedEmployeeEntity, EmployeeComplete, IEmployeeEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingEmployeeDataService } from './timekeeping-employee-data.service';
import { IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';

@Injectable({
	providedIn: 'root'
})

export class TimekeepingEmployeeCertificateDataService extends DataServiceFlatLeaf<ICertifiedEmployeeEntity, IEmployeeEntity, EmployeeComplete> {
	public constructor(timekeepingEmployeeDataService : TimekeepingEmployeeDataService) {
		const options: IDataServiceOptions<ICertifiedEmployeeEntity> = {
			apiUrl: 'timekeeping/employee/certification',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost:true,
				prepareParam: ident => {
					return { PKey1: ident.pKey1 };
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<ICertifiedEmployeeEntity, IEmployeeEntity, EmployeeComplete>> {
				role: ServiceRole.Leaf,
				itemName: 'Certification',
				parent: timekeepingEmployeeDataService
			}
		};

		super(options);
	}

	public override isParentFn(parentKey: IEmployeeEntity, entity: ICertifiedEmployeeEntity): boolean {
		return entity.EmployeeFk == parentKey.Id;
	}
}
