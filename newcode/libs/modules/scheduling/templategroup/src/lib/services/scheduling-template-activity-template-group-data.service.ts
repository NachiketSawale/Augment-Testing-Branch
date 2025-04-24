/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';

import { DataServiceFlatRoot, ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceRoleOptions } from '@libs/platform/data-access';
import { IActivityTemplateGroupEntity } from '../model/entities/activity-template-group-entity.interface';
import { IActivityTemplateGroupCompleteEntity } from '../model/entities/activity-template-group-complete-entity.interface';

export const SCHEDULING_TEMPLATE_ACTIVITY_TMPL_GRP_EDIT_DATA_TOKEN = new InjectionToken<SchedulingTemplateActivityTemplateGroupDataService>('schedulingTemplateActivityTmplGrpEditDataToken');

@Injectable({
	providedIn: 'root',
})
export class SchedulingTemplateActivityTemplateGroupDataService extends DataServiceFlatRoot<IActivityTemplateGroupEntity, IActivityTemplateGroupCompleteEntity> {
	public constructor() {
		const options: IDataServiceOptions<IActivityTemplateGroupEntity> = {
			apiUrl: 'scheduling/template/activitytemplategroup',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true,
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceRoleOptions<IActivityTemplateGroupEntity>>{
				role: ServiceRole.Root,
				itemName: 'defaultItemName',
			}
		};

		super(options);
	}
	public override createUpdateEntity(modified: IActivityTemplateGroupEntity | null): IActivityTemplateGroupCompleteEntity {
		return {
			MainItemId: null,
			ActivityTemplateGroups: null,
			ActivityTemplateGroup: null,
			ActivityTmplGrp2CUGrpToSave: null,
			ActivityTmplGrp2CUGrpToDelete: null
		};
	}
}
