/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { IEmployeeSkillDocumentEntity, IEmployeeSkillEntity, EmployeeSkillComplete } from '@libs/timekeeping/interfaces';
import { TimekeepingEmployeeSkillDataService } from './timekeeping-employee-skill-data.service';
import { DocumentDataLeafService } from '@libs/documents/shared';


@Injectable({
	providedIn: 'root'
})

export class TimekeepingEmployeeSkillDocumentService extends DocumentDataLeafService<IEmployeeSkillDocumentEntity, IEmployeeSkillEntity, EmployeeSkillComplete >{

	public constructor(timekeepingEmployeeSkillDataService:TimekeepingEmployeeSkillDataService) {
		const options: IDataServiceOptions<IEmployeeSkillDocumentEntity>  = {
			apiUrl: 'timekeeping/employee/skilldocument',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true,
				prepareParam: ident => {
					return { PKey1: ident.pKey1 };
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IEmployeeSkillDocumentEntity, IEmployeeSkillEntity, EmployeeSkillComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'SkillDocuments',
				parent: timekeepingEmployeeSkillDataService,
			},

		};

		super(options);
	}

	public override isParentFn(parentKey: IEmployeeSkillEntity, entity: IEmployeeSkillDocumentEntity): boolean {
		return entity.EmployeeSkillFk == parentKey.Id;
	}

}



