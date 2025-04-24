/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { IActionEmployeeEntity, IProjectMainActionComplete } from '@libs/project/interfaces';
import { IActionEntity } from '@libs/project/interfaces';
import { ProjectMainActionDataService } from './project-main-action-data.service';


@Injectable({
	providedIn: 'root'
})

export class ProjectMainActionEmployeeDataService extends DataServiceFlatLeaf<IActionEmployeeEntity,IActionEntity, IProjectMainActionComplete >{

	public constructor(projectMainActionDataService:ProjectMainActionDataService) {
		const options: IDataServiceOptions<IActionEmployeeEntity>  = {
			apiUrl: 'project/main/actionemployee',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true,
				prepareParam: ident => {
					return {
						PKey1: ident.pKey1,
						PKey2: ident.pKey2
					};
				}
			},
			createInfo: {
				prepareParam: () => {
					const selection = projectMainActionDataService.getSelectedEntity();
					return {
						PKey1: selection?.Id ?? 0,
						PKey2: selection?.ProjectFk ?? 0
					};
				}
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceChildRoleOptions<IActionEmployeeEntity,IActionEntity, IProjectMainActionComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'ActionEmployees',
				parent: projectMainActionDataService,
			},

		};

		super(options);
	}

	public override isParentFn(parentKey: IActionEntity, entity: IActionEmployeeEntity): boolean {
		return entity.ActionFk === parentKey.Id;
	}

}





