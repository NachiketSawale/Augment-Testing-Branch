/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';

import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, DataServiceFlatLeaf, IDataServiceChildRoleOptions } from '@libs/platform/data-access';
import { IActivityTmplGrp2CUGrpEntity } from '../model/entities/activity-tmpl-grp-2cugrp-entity.interface';
import { IActivityTemplateGroupEntity } from '../model/entities/activity-template-group-entity.interface';
import { SchedulingTemplateActivityTemplateGroupDataService } from './scheduling-template-activity-template-group-data.service';
import { IActivityTemplateGroupCompleteEntity } from '../model/entities/activity-template-group-complete-entity.interface';


export const SCHEDULING_TEMPLATE_ACTIVITY_TMPL_GRP2_CUGRP_DATA_TOKEN = new InjectionToken<SchedulingTemplateActivityTemplateGroup2CugroupDataService>('schedulingTemplateActivityTmplGrp2CUGrpDataToken');

@Injectable({
	providedIn: 'root',
})
export class SchedulingTemplateActivityTemplateGroup2CugroupDataService extends DataServiceFlatLeaf<IActivityTmplGrp2CUGrpEntity, IActivityTemplateGroupEntity, IActivityTemplateGroupCompleteEntity> {
	public constructor(schedulingTemplateActivityTemplateGroupDataService : SchedulingTemplateActivityTemplateGroupDataService) {
		const options: IDataServiceOptions<IActivityTmplGrp2CUGrpEntity> = {
			apiUrl: 'scheduling/template/activitytmplgrp2cugrp',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: ident => {
					return { mainItemId : ident.pKey1};
				}
			},
			createInfo:{
				prepareParam: ident => {
					return { pKey1: ident.id};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IActivityTmplGrp2CUGrpEntity,
				IActivityTemplateGroupEntity, IActivityTemplateGroupCompleteEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'activityTemplateGroup2CuGroup',
				parent: schedulingTemplateActivityTemplateGroupDataService
			}
		};

		super(options);
	}
}
