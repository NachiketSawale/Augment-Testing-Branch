/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';


import { DataServiceFlatNode,ServiceRole,IDataServiceOptions, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';



import { SchedulingTemplateActivityCriteriaComplete } from '../model/scheduling-template-activity-criteria-complete.class';
import { IActivityCriteriaEntity } from '../model/entities/activity-criteria-entity.interface';
import { IActivityTemplateEntity } from '../model/entities/activity-template-entity.interface';
import { SchedulingTemplateMainComplete } from '../model/scheduling-template-main-complete.class';
import { SchedulingTemplateMainDataService } from './scheduling-template-main-data.service';
import { ActivityCriteriaLoaded } from '../model/entities/activity-criteria-loaded.class';






@Injectable({
	providedIn: 'root'
})



export class SchedulingTemplateActivityCriteriaDataService extends DataServiceFlatNode<IActivityCriteriaEntity, SchedulingTemplateActivityCriteriaComplete,IActivityTemplateEntity, SchedulingTemplateMainComplete >{

	public constructor( schedulingTemplateMainDataService : SchedulingTemplateMainDataService) {
		const options: IDataServiceOptions<IActivityCriteriaEntity>  = {
			apiUrl: 'scheduling/template/activitycriteria',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: true,
				prepareParam: ident => {

					return { PKey1: ident.pKey1 };
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IActivityCriteriaEntity,IActivityTemplateEntity, SchedulingTemplateMainComplete>>{
				role: ServiceRole.Node,
				itemName: 'ActivityCriteria',
				parent: schedulingTemplateMainDataService,
			},
		};

		super(options);


	}
	protected override onLoadSucceeded(loaded: ActivityCriteriaLoaded): IActivityCriteriaEntity[] {
		if (loaded){
			return loaded.dtos;
		}
		return [];
	}
}



