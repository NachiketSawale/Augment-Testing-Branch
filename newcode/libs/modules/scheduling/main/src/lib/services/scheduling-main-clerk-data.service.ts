/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceOptions,} from '@libs/platform/data-access';
import { IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { IActivityClerkEntity,IActivityEntity } from '@libs/scheduling/interfaces';
import { ActivityComplete } from '../model/activity-complete.class';
import { SchedulingMainDataService } from './scheduling-main-data.service';
@Injectable({
	providedIn: 'root'
})

export class SchedulingMainClerkDataService extends DataServiceFlatLeaf<IActivityClerkEntity,
	IActivityEntity, ActivityComplete> {

	public constructor(schedulingMainDataService : SchedulingMainDataService) {
		const options: IDataServiceOptions<IActivityClerkEntity> = {
			apiUrl: 'scheduling/main/clerk',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: ident => {
					const selection = schedulingMainDataService.getSelection()[0];
					return { mainItemId: selection.Id };
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IActivityClerkEntity,
				IActivityEntity, ActivityComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Clerks',
				parent: schedulingMainDataService
			}
		};
		super(options);
	}

	public override registerModificationsToParentUpdate(complete: ActivityComplete, modified: IActivityClerkEntity[], deleted: IActivityClerkEntity[]) {
		if (modified && modified.length > 0) {
			complete.ClerksToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			complete.ClerksToDelete = deleted;
		}
	}

}
