/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable} from '@angular/core';
import { IIdentificationData } from '@libs/platform/common';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { IRequisitionEntity, IRequisitionRequiredSkillEntity } from '@libs/resource/interfaces';
import { RequisitionComplete } from '../model/requisition-complete.class';
import { ResourceRequisitionDataService } from './resource-requisition-data.service';


@Injectable({
	providedIn: 'root'
})


export class ResourceRequisitionRequiredSkillDataService extends DataServiceFlatLeaf<IRequisitionRequiredSkillEntity,IRequisitionEntity, RequisitionComplete >{

	public constructor(resourceRequisitionDataService:ResourceRequisitionDataService) {
		const options: IDataServiceOptions<IRequisitionRequiredSkillEntity>  = {
			apiUrl: 'resource/requisition/requiredskill',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: true
			},
			createInfo: <IDataServiceEndPointOptions>{
				prepareParam: (ident: IIdentificationData) => {
					return {
						PKey1: ident.pKey1,
						filter: '',
					};
				}
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceChildRoleOptions<IRequisitionRequiredSkillEntity,IRequisitionEntity, RequisitionComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'RequiredSkills',
				parent: resourceRequisitionDataService,
			},


		};

		super(options);
	}

	public override isParentFn(parentKey: IRequisitionEntity, entity: IRequisitionRequiredSkillEntity): boolean {
		return entity.RequisitionFk === parentKey.Id;
	}


}








