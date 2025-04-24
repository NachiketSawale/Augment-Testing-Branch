/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';



import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';


import { IActivityTemplateEntity } from '../model/entities/activity-template-entity.interface';
import { SchedulingTemplateMainComplete } from '../model/scheduling-template-main-complete.class';
import { SchedulingTemplateMainDataService } from './scheduling-template-main-data.service';
import {IActivityTmplGrp2CUGrpEntity} from '@libs/scheduling/templategroup';



@Injectable({
	providedIn: 'root'
})





export class SchedulingTemplateActivityTmpl2CUGrpDataService extends DataServiceFlatLeaf<IActivityTmplGrp2CUGrpEntity,IActivityTemplateEntity, SchedulingTemplateMainComplete >{

	public constructor(schedulingTemplateActivityTemplateService : SchedulingTemplateMainDataService) {
		const options: IDataServiceOptions<IActivityTmplGrp2CUGrpEntity>  = {
			apiUrl: 'scheduling/template/activitytmpl2cugrp',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true,
				prepareParam: ident => {
					const selection = schedulingTemplateActivityTemplateService.getSelection()[0];

					return { PKey1: selection.Id,
						PKey2: selection.ActivityTemplateGroupFk };
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IActivityTmplGrp2CUGrpEntity,IActivityTemplateEntity, SchedulingTemplateMainComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'ActivityTmpl2CUGrp',
				parent: schedulingTemplateActivityTemplateService,
			},
		};
		super(options);
	}

}

