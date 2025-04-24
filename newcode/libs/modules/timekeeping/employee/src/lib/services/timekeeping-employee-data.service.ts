/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceRoleOptions,ServiceRole} from '@libs/platform/data-access';
import {  EmployeeComplete, IEmployeeEntity, ICrewAssignmentEntity } from '@libs/timekeeping/interfaces';

import { IDataServiceOptions } from '@libs/platform/data-access';


@Injectable({
	providedIn: 'root'
})

export class TimekeepingEmployeeDataService extends DataServiceFlatRoot<IEmployeeEntity, EmployeeComplete> {
	public constructor() {
		const options: IDataServiceOptions<IEmployeeEntity> = {
			apiUrl: 'timekeeping/Employee',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceRoleOptions<IEmployeeEntity>>{
				role: ServiceRole.Root,
				itemName: 'Employees'
			}
		};

		super(options);
	}
	public override createUpdateEntity(modified: IEmployeeEntity | null): EmployeeComplete {
		const complete = new EmployeeComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.Employees = [modified];
			complete.Employees.forEach(e => {
				if (e.DescriptionInfo?.Translated){
					e.DescriptionInfo.Modified = true;
				}
			});
		}

		return complete;
	}

	public override getModificationsFromUpdate(complete: EmployeeComplete): IEmployeeEntity[] {
		if (complete.Employees){
			return complete.Employees;
		}
		return [];
	}

	public setCrewLeader(crewAssignment?: ICrewAssignmentEntity){
		const selected = this.getSelection()[0];
		if (crewAssignment && crewAssignment.EmployeeCrewFk) {
			selected.CrewLeaderFk = crewAssignment.EmployeeCrewFk;
		} else {
			selected.CrewLeaderFk = 0;
		}
		this.setModified(selected);
	}
}
