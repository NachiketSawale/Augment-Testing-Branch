/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';



import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';


import { IPerformanceRuleEntity } from '../model/entities/performance-rule-entity.interface';
import { IActivityTemplateEntity } from '../model/entities/activity-template-entity.interface';
import { SchedulingTemplateMainComplete } from '../model/scheduling-template-main-complete.class';
import { SchedulingTemplateMainDataService } from './scheduling-template-main-data.service';




@Injectable({
	providedIn: 'root'
})





export class SchedulingTemplatePerformanceRuleDataService extends DataServiceFlatLeaf<IPerformanceRuleEntity,IActivityTemplateEntity, SchedulingTemplateMainComplete >{

	public constructor(schedulingTemplateActivityTemplateService : SchedulingTemplateMainDataService) {
		const options: IDataServiceOptions<IActivityTemplateEntity>  = {
			apiUrl: 'scheduling/template/performancerule',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: ident => {
					return { mainItemId: ident.pKey1 };
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IPerformanceRuleEntity,IActivityTemplateEntity, SchedulingTemplateMainComplete>>{
				role: ServiceRole.Leaf,
				itemName:' PerformanceRule',
				parent: schedulingTemplateActivityTemplateService,
			},


		};

		super(options);
	}

}

