/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, DataServiceFlatNode, IDataServiceChildRoleOptions } from '@libs/platform/data-access';
import { IScheduleEntity } from '@libs/scheduling/interfaces';
import { SchedulingScheduleCompleteClass } from '../scheduling-schedule-complete.class';
import { IProjectComplete, IProjectEntity, PROJECT_SERVICE_TOKEN } from '@libs/project/interfaces';
import { IIdentificationData, IPinningContext } from '@libs/platform/common';
import { isNil } from 'lodash';

@Injectable({
	providedIn: 'root',
})
export class SchedulingScheduleDataService extends DataServiceFlatNode<IScheduleEntity, SchedulingScheduleCompleteClass, IProjectEntity, IProjectComplete> {
	public constructor() {
		const options: IDataServiceOptions<IScheduleEntity> = {
			apiUrl: 'scheduling/schedule',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listmasterschedules',
				usePost: false,
				prepareParam: (ident: IIdentificationData) => {
					return { mainItemId: ident.pKey1! };
				},
			},
			createInfo: {
				prepareParam: ident => {
					return {
						PKey1: ident.pKey1!
					};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IScheduleEntity, IProjectEntity, IProjectComplete>>{
				role: ServiceRole.Node,
				itemName: 'Schedules',
				parent: PROJECT_SERVICE_TOKEN,
			},
		};
		super(options);
	}

	/**
	 * create update entity
	 * @param modified
	 */
	public override createUpdateEntity(modified: IScheduleEntity | null): SchedulingScheduleCompleteClass {
		const complete = new SchedulingScheduleCompleteClass();
		return complete;
	}

	public override preparePinningContext(dataService: this): IPinningContext[] {
		const pinningContext: IPinningContext[] = [];
		const selectedParent = dataService.getSelectedParent();
		const selectedEntity = dataService.getSelectedEntity();
		if (!isNil(selectedParent) && !isNil(selectedEntity)) {
			{
				pinningContext.push({ Id: selectedEntity.Id, Token: 'scheduling.main', Info: selectedEntity.Code });
				pinningContext.push({ Id: selectedParent.Id, Token: 'project.main', Info: selectedParent.ProjectName2 });
			}
		}
		return pinningContext;
	}

}