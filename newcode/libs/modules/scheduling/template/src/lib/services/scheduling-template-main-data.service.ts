/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceChildRoleOptions, DataServiceFlatNode } from '@libs/platform/data-access';




import { SchedulingTemplateMainComplete } from '../model/scheduling-template-main-complete.class';
import { IActivityTemplateEntity } from '../model/entities/activity-template-entity.interface';
import { IActivityTemplateGroupCompleteEntity, IActivityTemplateGroupEntity, SchedulingTemplateActivityTemplateGroupDataService } from '@libs/scheduling/templategroup';


class ActivityTemplateLoaded {
	public dtos!: IActivityTemplateEntity[];
}

@Injectable({
	providedIn: 'root'
})

export class SchedulingTemplateMainDataService extends DataServiceFlatNode<IActivityTemplateEntity,
	SchedulingTemplateMainComplete, IActivityTemplateGroupEntity, IActivityTemplateGroupCompleteEntity> {

	public constructor(private schedulingTemplateActivityTemplateGroupDataService :SchedulingTemplateActivityTemplateGroupDataService) {
		const options: IDataServiceOptions<IActivityTemplateEntity> = {
			apiUrl: 'scheduling/template/activitytemplate',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceChildRoleOptions<IActivityTemplateEntity,
				IActivityTemplateGroupEntity, IActivityTemplateGroupCompleteEntity>>{
				role: ServiceRole.Node,
				itemName: 'ActivityTemplates',
				parent: schedulingTemplateActivityTemplateGroupDataService
			}
		};
		super(options);
	}

	public override createUpdateEntity(modified: IActivityTemplateEntity | null): SchedulingTemplateMainComplete {
		return {
			MainItemId: null,
			ActivityTemplate: null,
			ActivityTemplates: null,
			EventTemplateToSave: null,
			EventTemplateToDelete: null,
			PerformanceRuleToSave: null,
			PerformanceRuleToDelete: null,
			ActivityTmpl2CUGrpToSave: null,
			ActivityTmpl2CUGrpToDelete: null,
			ActivityCriteriaToSave: null,
			ActivityCriteriaToDelete: null,
			DocumentToSave: null,
			DocumentToDelete: null
		};

	}

	protected override onLoadSucceeded(loaded: ActivityTemplateLoaded): IActivityTemplateEntity[] {
		if (loaded){
			return loaded.dtos;
		}

		return [];
	}

	protected override provideLoadPayload(): object {
		return {
			furtherFilters : [
				{
					Token	: 'TMPLGROUP',
					Value: this.schedulingTemplateActivityTemplateGroupDataService.getSelection()[0].Id
				}
			]
		};
	}
}





