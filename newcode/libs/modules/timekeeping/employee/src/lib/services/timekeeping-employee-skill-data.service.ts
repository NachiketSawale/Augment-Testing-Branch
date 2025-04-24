/*
 * Copyright(c) RIB Software GmbH
 */
import {  Injectable } from '@angular/core';
import {  DataServiceFlatNode, IDataServiceChildRoleOptions, IDataServiceOptions } from '@libs/platform/data-access';
import { IEmployeeSkillEntity, EmployeeComplete, IEmployeeEntity, EmployeeSkillComplete } from '@libs/timekeeping/interfaces';
import { IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { TimekeepingEmployeeDataService } from './timekeeping-employee-data.service';



@Injectable({
	providedIn: 'root'
})

export class TimekeepingEmployeeSkillDataService extends DataServiceFlatNode<IEmployeeSkillEntity,EmployeeSkillComplete,IEmployeeEntity, EmployeeComplete> {

	public constructor(timekeepingEmployeeDataService : TimekeepingEmployeeDataService) {
		const options: IDataServiceOptions<IEmployeeSkillEntity> = {
			apiUrl: 'timekeeping/employee/skill',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: true,
				prepareParam: ident => {
              return { PKey1: ident.pKey1 };
            }
			},
			roleInfo: <IDataServiceChildRoleOptions<IEmployeeSkillEntity, IEmployeeEntity, EmployeeComplete>> {
				role: ServiceRole.Node,
				itemName: 'Skills',
				parent: timekeepingEmployeeDataService
			}
		};

		super(options);
	}

	public override isParentFn(parentKey: IEmployeeEntity, entity: IEmployeeSkillEntity): boolean {
		return entity.EmployeeFk == parentKey.Id;
	}

	public override createUpdateEntity(modified: IEmployeeSkillEntity | null): EmployeeSkillComplete {
		const complete = new EmployeeSkillComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.Skills = modified;
		}
		return complete;
	}
}
