/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { LogisticJobPrj2MaterialDataService } from './logistic-job-prj2-material-data.service';
import { IProject2MaterialEntity, IProject2MaterialPriceConditionEntity } from '@libs/logistic/interfaces';
import { Project2MaterialComplete } from '../model/project2-material-complete.class';
import { IIdentificationData } from '@libs/platform/common';


@Injectable({
	providedIn: 'root'
})

export class LogisticJobPrj2MaterialPriceConditionDataService extends DataServiceFlatLeaf<IProject2MaterialPriceConditionEntity,IProject2MaterialEntity,Project2MaterialComplete >{

	public constructor( logisticJobPrj2MaterialDataService:LogisticJobPrj2MaterialDataService) {
		const options: IDataServiceOptions<IProject2MaterialPriceConditionEntity>  = {
			apiUrl: 'logistic/job/project2materialpricecondition',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true,
				prepareParam: ident => {
					return {
						PKey1: ident.pKey1
					};
				}
			},
			createInfo: <IDataServiceEndPointOptions>{
				prepareParam: (ident: IIdentificationData) => {
					return {
						PKey1: ident.pKey1,
					};
				}
			},

			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceChildRoleOptions<IProject2MaterialPriceConditionEntity,IProject2MaterialEntity,Project2MaterialComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'MaterialPriceConditions',
				//parent: logisticJobPrj2MaterialDataService,
			},
		};

		super(options);
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(complete: Project2MaterialComplete, modified: IProject2MaterialPriceConditionEntity[], deleted: IProject2MaterialPriceConditionEntity[]) {
		if (modified && modified.length > 0) {
			complete.MaterialPriceConditionsToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			complete.MaterialPriceConditionsToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: Project2MaterialComplete): IProject2MaterialPriceConditionEntity[] {
		if (complete && complete.MaterialPriceConditionsToSave) {
			return complete.MaterialPriceConditionsToSave;
		}

		return [];
	}
	public override isParentFn(parentKey: IProject2MaterialEntity, entity: IProject2MaterialPriceConditionEntity): boolean {
		return entity.ProjectMaterialFk === parentKey.Id;
	}
}



