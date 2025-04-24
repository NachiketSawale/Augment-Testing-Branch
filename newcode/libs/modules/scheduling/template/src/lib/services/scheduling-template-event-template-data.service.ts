/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable  } from '@angular/core';



import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';


import { IEventTemplateEntity } from '../model/entities/event-template-entity.interface';
import { IActivityTemplateEntity } from '../model/entities/activity-template-entity.interface';
import { SchedulingTemplateMainDataService } from './scheduling-template-main-data.service';
import { SchedulingTemplateMainComplete } from '../model/scheduling-template-main-complete.class';




@Injectable({
	providedIn: 'root'
})





export class SchedulingTemplateEventTemplateDataService extends DataServiceFlatLeaf<IEventTemplateEntity,IActivityTemplateEntity, SchedulingTemplateMainComplete >{

	public constructor(schedulingTemplateActivityTemplateService : SchedulingTemplateMainDataService) {
		const options: IDataServiceOptions<IActivityTemplateEntity>  = {
			apiUrl: 'scheduling/template/eventtemplate',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: ident => {
					return { mainItemId: ident.pKey1 };
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IEventTemplateEntity,IActivityTemplateEntity, SchedulingTemplateMainComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'EventTemplate',
				parent: schedulingTemplateActivityTemplateService,
			},
		};

		super(options);
	}

}

